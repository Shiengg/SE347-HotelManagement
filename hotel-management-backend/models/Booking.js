const mongoose = require("mongoose");
const User = require("./User");
const Room = require("./Rooms");
const Service = require("./Service");

const serviceSchema = new mongoose.Schema({
  serviceID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  }
});

const bookingSchema = new mongoose.Schema({
  customerID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receptionistID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  roomID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  checkInDate: {
    type: Date,
    required: true
  },
  checkOutDate: {
    type: Date,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  services: [serviceSchema],
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Cancelled'],
    default: 'Pending'
  }
}, {
  timestamps: true
});

bookingSchema.index(
  { customerID: 1, roomID: 1, checkInDate: 1 },
  { unique: true }
);

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
