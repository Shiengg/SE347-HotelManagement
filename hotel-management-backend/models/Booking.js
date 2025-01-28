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

// Thêm đoạn này để xóa index khi khởi động
mongoose.connection.once('connected', async () => {
  try {
    const collection = mongoose.connection.collection('bookings');
    const indexes = await collection.indexes();
    const indexExists = indexes.find(index => 
      index.name === 'customerID_1_roomID_1_checkInDate_1'
    );
    
    if (indexExists) {
      console.log('Dropping existing unique index...');
      await collection.dropIndex('customerID_1_roomID_1_checkInDate_1');
      console.log('Index dropped successfully');
    }
  } catch (error) {
    console.error('Error handling indexes:', error);
  }
});

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
