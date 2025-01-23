const Booking = require('../models/Booking');
const Service = require('../models/Service');
const Room = require('../models/Rooms');
const mongoose = require('mongoose');

// Export các hàm controller
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('customerID', 'name email phone')
      .populate('receptionistID', 'name')
      .populate('roomID', 'roomNumber roomType')
      .populate('services.serviceID', 'name price');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createBooking = async (req, res) => {
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
      return res.status(400).json({ message: 'Room not found' });
    }

    const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    const roomPrice = room.price * days;
    const totalPrice = roomPrice + totalServicePrice;

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

    const newBooking = await booking.save();
    const populatedBooking = await Booking.findById(newBooking._id)
      .populate('customerID', 'name email phone')
      .populate('receptionistID', 'name')
      .populate('roomID', 'roomNumber roomType')
      .populate('services.serviceID', 'serviceName servicePrice');

    res.status(201).json(populatedBooking);
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(400).json({ 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('customerID', 'name email phone')
      .populate('receptionistID', 'name')
      .populate('roomID', 'roomNumber roomType')
      .populate('services.serviceID', 'name price');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateBooking = async (req, res) => {
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

    // Tính toán giá tiền tương tự như createBooking
    let totalServicePrice = 0;
    const servicesWithPrice = await Promise.all(services.map(async (service) => {
      const serviceData = await Service.findById(service.serviceID);
      const serviceTotal = serviceData.servicePrice * service.quantity;
      totalServicePrice += serviceTotal;
      return {
        serviceID: service.serviceID,
        quantity: service.quantity,
        totalPrice: serviceTotal
      };
    }));

    const room = await Room.findById(roomID);
    const days = Math.ceil((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24));
    const roomPrice = room.price * days;
    const totalPrice = roomPrice + totalServicePrice;

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      {
        customerID,
        receptionistID,
        roomID,
        checkInDate,
        checkOutDate,
        services: servicesWithPrice,
        status,
        totalPrice
      },
      { new: true }
    )
    .populate('customerID', 'name email phone')
    .populate('receptionistID', 'name')
    .populate('roomID', 'roomNumber roomType')
    .populate('services.serviceID', 'serviceName servicePrice');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(400).json({ message: error.message });
  }
};

exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 