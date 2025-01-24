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

    // Chỉ tạo invoice nếu status là Confirmed
    let invoice = null;
    if (status === 'Confirmed') {
      invoice = new Invoice({
        bookingID: newBooking._id,
        totalAmount: calculatedTotalPrice,
        paymentMethod: 'Cash',
        paymentStatus: false,
        paymentDate: new Date()
      });
      await invoice.save({ session });
    }

    // Cập nhật trạng thái phòng dựa theo status của booking
    await updateRoomStatus(roomID, status || 'Pending', session);

    await session.commitTransaction();

    const populatedBooking = await Booking.findById(newBooking._id)
      .populate('customerID', 'fullname email phone')
      .populate('receptionistID', 'fullname')
      .populate('roomID', 'roomNumber roomType')
      .populate('services.serviceID', 'serviceName servicePrice');

    res.status(201).json({
      booking: populatedBooking,
      invoice: invoice
    });

  } catch (error) {
    await session.abortTransaction();
    console.error('Create booking error:', error);
    res.status(400).json({ 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
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
    const {
      customerID,
      roomID,
      bookingType,
      checkInDate,
      checkOutDate,
      totalDays,
      totalHours,
      services,
      status
    } = req.body;

    // Tính lại tổng tiền dịch vụ
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

    // Lấy thông tin phòng để tính giá
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

    // Cập nhật booking với giá mới
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      {
        customerID,
        roomID,
        bookingType,
        checkInDate,
        checkOutDate,
        totalDays,
        totalHours,
        services: servicesWithPrice,
        status,
        totalPrice: calculatedTotalPrice
      },
      { new: true, session }
    );

    // Cập nhật hoặc tạo mới invoice nếu status là Confirmed
    if (status === 'Confirmed') {
      const existingInvoice = await Invoice.findOne({ bookingID: req.params.id });
      if (existingInvoice) {
        await Invoice.findByIdAndUpdate(
          existingInvoice._id,
          { totalAmount: calculatedTotalPrice },
          { session }
        );
      } else {
        const newInvoice = new Invoice({
          bookingID: updatedBooking._id,
          totalAmount: calculatedTotalPrice,
          paymentMethod: 'Cash',
          paymentStatus: false,
          paymentDate: new Date()
        });
        await newInvoice.save({ session });
      }
    }

    await session.commitTransaction();

    // Populate và trả về booking đã cập nhật
    const populatedBooking = await Booking.findById(updatedBooking._id)
      .populate('customerID', 'fullname email phone')
      .populate('receptionistID', 'fullname')
      .populate('roomID', 'roomNumber roomType dailyPrice hourlyPrice')
      .populate('services.serviceID', 'serviceName servicePrice');

    res.json(populatedBooking);
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

    // Kiểm tra nếu booking đã confirmed và có invoice
    if (booking.status === 'Confirmed') {
      const invoice = await Invoice.findOne({ bookingID: booking._id });
      if (invoice) {
        return res.status(400).json({ 
          message: 'Cannot delete confirmed booking with invoice',
          booking: {
            id: booking._id,
            status: booking.status,
            invoice: invoice._id
          }
        });
      }
    }

    // Cập nhật trạng thái phòng về Available
    await updateRoomStatus(booking.roomID, 'Cancelled', session);

    // Xóa booking
    await Booking.findByIdAndDelete(booking._id, { session });

    await session.commitTransaction();
    res.json({ 
      message: 'Booking deleted successfully',
      deletedBooking: booking
    });

  } catch (error) {
    await session.abortTransaction();
    res.status(error.message === 'Booking not found' ? 404 : 500).json({ 
      message: error.message 
    });
  } finally {
    session.endSession();
  }
}; 