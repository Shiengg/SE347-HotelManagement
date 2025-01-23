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
        select: 'roomNumber roomType price'
      })
      .populate({
        path: 'services.serviceID',
        select: 'serviceName servicePrice'
      });

    // Log để debug
    console.log('Fetched bookings:', JSON.stringify(bookings, null, 2));

    res.json(bookings);
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
      checkInDate,
      checkOutDate,
      services,
      status,
      receptionistID
    } = req.body;

    // Log request data để debug
    console.log('Received booking data:', req.body);

    // Validate required fields
    if (!customerID || !roomID || !checkInDate || !checkOutDate || !receptionistID) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        required: ['customerID', 'roomID', 'checkInDate', 'checkOutDate', 'receptionistID'],
        received: {
          customerID,
          roomID,
          checkInDate,
          checkOutDate,
          receptionistID
        }
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

    const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    const roomPrice = room.price * days;
    const totalPrice = roomPrice + totalServicePrice;

    // Tạo booking
    const booking = new Booking({
      customerID,
      receptionistID,
      roomID,
      checkInDate,
      checkOutDate,
      services: servicesWithPrice,
      status: status || 'Pending',
      totalPrice
    });

    const newBooking = await booking.save({ session });

    // Chỉ tạo invoice nếu status là Confirmed
    let invoice = null;
    if (status === 'Confirmed') {
      invoice = new Invoice({
        bookingID: newBooking._id,
        totalAmount: totalPrice,
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
    const { status } = req.body;
    const oldBooking = await Booking.findById(req.params.id);
    
    if (!oldBooking) {
      throw new Error('Booking not found');
    }

    // Cập nhật booking
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, session }
    );

    // Xử lý invoice khi chuyển sang Confirmed
    let invoice = await Invoice.findOne({ bookingID: updatedBooking._id });
    if (status === 'Confirmed' && oldBooking.status !== 'Confirmed') {
      if (!invoice) {
        invoice = new Invoice({
          bookingID: updatedBooking._id,
          totalAmount: updatedBooking.totalPrice,
          paymentMethod: 'Cash',
          paymentStatus: false,
          paymentDate: new Date()
        });
        await invoice.save({ session });
      }
    }

    // Cập nhật trạng thái phòng dựa theo status mới của booking
    await updateRoomStatus(updatedBooking.roomID, status, session);

    await session.commitTransaction();

    const populatedBooking = await Booking.findById(updatedBooking._id)
      .populate('customerID', 'fullname email phone')
      .populate('receptionistID', 'fullname')
      .populate('roomID', 'roomNumber roomType')
      .populate('services.serviceID', 'serviceName servicePrice');

    res.json({
      booking: populatedBooking,
      invoice: invoice
    });

  } catch (error) {
    await session.abortTransaction();
    console.error('Update booking error:', error);
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