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
    ref: 'User'
  },
  roomID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  bookingType: {
    type: String,
    enum: ['Hourly', 'Daily'],
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
  totalDays: {
    type: Number,
    default: 0
  },
  totalHours: {
    type: Number,
    default: 0
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  services: [{
    serviceID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service'
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    }
  }],
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  invoice: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Invoice'
  }
}, {
  timestamps: true
});

bookingSchema.index(
  { customerID: 1, roomID: 1, checkInDate: 1 },
  { unique: false }
);

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
