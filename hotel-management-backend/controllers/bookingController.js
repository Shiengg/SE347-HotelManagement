const Booking = require('../models/Booking');
const Service = require('../models/Service');
const Room = require('../models/Rooms');
const Invoice = require('../models/Invoice');
const mongoose = require('mongoose');

// Export các hàm controller
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate({
        path: 'customerID',
        select: 'fullname email phone username'
      })
      .populate({
        path: 'receptionistID',
        select: 'fullname username'
      })
      .populate({
        path: 'roomID',
        select: 'roomNumber roomType dailyPrice hourlyPrice'
      })
      .populate({
        path: 'services.serviceID',
        select: 'serviceName servicePrice'
      });

    // Tính lại tổng tiền cho mỗi booking để đảm bảo chính xác
    const calculatedBookings = bookings.map(booking => {
      const roomPrice = booking.bookingType === 'Daily' 
        ? booking.roomID.dailyPrice * booking.totalDays
        : booking.roomID.hourlyPrice * booking.totalHours;

      const servicesPrice = booking.services.reduce((total, service) => 
        total + (service.serviceID.servicePrice * service.quantity), 0);

      booking.totalPrice = roomPrice + servicesPrice;
      return booking;
    });

    res.json(calculatedBookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: error.message });
  }
};

// Thêm hàm helper để xử lý trạng thái phòng
const updateRoomStatus = async (roomId, bookingStatus, session) => {
  let roomStatus;
  switch (bookingStatus) {
    case 'Pending':
      roomStatus = 'Reserved';
      break;
    case 'Confirmed':
      roomStatus = 'Occupied';
      break;
    case 'Cancelled':
    default:
      roomStatus = 'Available';
      break;
  }

  await Room.findByIdAndUpdate(
    roomId,
    { status: roomStatus },
    { session }
  );
};

exports.createBooking = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      customerID,
      roomID,
      bookingType,
      checkInDate,
      checkOutDate,
      totalDays,
      totalHours,
      services,
      status,
      receptionistID,
      totalPrice: submittedTotalPrice
    } = req.body;

    // Log request data để debug
    console.log('Received booking data:', req.body);

    // Validate required fields
    if (!customerID || !roomID || !checkInDate || !checkOutDate || !receptionistID || !bookingType) {
      return res.status(400).json({ 
        message: 'Missing required fields'
      });
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(customerID) || 
        !mongoose.Types.ObjectId.isValid(roomID) || 
        !mongoose.Types.ObjectId.isValid(receptionistID)) {
      return res.status(400).json({ 
        message: 'Invalid ID format',
        invalidFields: {
          customerID: !mongoose.Types.ObjectId.isValid(customerID),
          roomID: !mongoose.Types.ObjectId.isValid(roomID),
          receptionistID: !mongoose.Types.ObjectId.isValid(receptionistID)
        }
      });
    }

    // Validate dates
    const startDate = new Date(checkInDate);
    const endDate = new Date(checkOutDate);
    if (startDate >= endDate) {
      return res.status(400).json({ 
        message: 'Check-out date must be after check-in date' 
      });
    }

    // Calculate prices and create booking
    let totalServicePrice = 0;
    const servicesWithPrice = await Promise.all(services.map(async (service) => {
      const serviceData = await Service.findById(service.serviceID);
      if (!serviceData) {
        throw new Error(`Service not found: ${service.serviceID}`);
      }
      const serviceTotal = serviceData.servicePrice * service.quantity;
      totalServicePrice += serviceTotal;
      return {
        serviceID: service.serviceID,
        quantity: service.quantity,
        totalPrice: serviceTotal
      };
    }));

    const room = await Room.findById(roomID);
    if (!room) {
      throw new Error('Room not found');
    }

    // Tính giá phòng dựa trên loại booking
    let roomPrice;
    if (bookingType === 'Daily') {
      roomPrice = room.dailyPrice * totalDays;
    } else {
      roomPrice = room.hourlyPrice * totalHours;
    }

    // Tính tổng tiền cuối cùng
    const calculatedTotalPrice = roomPrice + totalServicePrice;

    // Tạo booking với giá đã tính
    const booking = new Booking({
      customerID,
      receptionistID,
      roomID,
      bookingType,
      checkInDate,
      checkOutDate,
      totalDays,
      totalHours,
      services: servicesWithPrice,
      status: status || 'Pending',
      totalPrice: calculatedTotalPrice
    });

    const newBooking = await booking.save({ session });

    // Cập nhật trạng thái phòng dựa trên trạng thái booking
    const roomStatus = booking.status === 'Confirmed' ? 'Occupied' : 'Reserved';
    await Room.findByIdAndUpdate(
      booking.roomID,
      { status: roomStatus },
      { session }
    );

    await session.commitTransaction();
    res.status(201).json(newBooking);
  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({ message: error.message });
  } finally {
    session.endSession();
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('customerID', 'fullname email phone')
      .populate('receptionistID', 'fullname')
      .populate('roomID', 'roomNumber roomType price')
      .populate('services.serviceID', 'serviceName servicePrice');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateBooking = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      throw new Error('Booking not found');
    }

    // Cập nhật trạng thái phòng dựa trên trạng thái booking mới
    const roomStatus = status === 'Confirmed' ? 'Occupied' : 'Reserved';
    await Room.findByIdAndUpdate(
      booking.roomID,
      { status: roomStatus },
      { session }
    );

    // Cập nhật booking
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, session }
    );

    await session.commitTransaction();
    res.json(updatedBooking);
  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({ message: error.message });
  } finally {
    session.endSession();
  }
};

exports.deleteBooking = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      throw new Error('Booking not found');
    }

    // Lấy roomId trước khi xóa booking
    const roomId = booking.roomID;

    // Xóa booking
    await Booking.findByIdAndDelete(booking._id, { session });

    // Kiểm tra xem còn booking nào khác cho phòng này không
    const otherBookings = await Booking.find({
      roomID: roomId,
      status: { $in: ['Pending', 'Confirmed'] },
      _id: { $ne: booking._id }
    }).session(session);

    if (otherBookings.length === 0) {
      // Nếu không còn booking nào, đặt phòng về trạng thái Available
      await Room.findByIdAndUpdate(
        roomId,
        { status: 'Available' },
        { session }
      );
    }

    await session.commitTransaction();
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({ message: error.message });
  } finally {
    session.endSession();
  }
}; 