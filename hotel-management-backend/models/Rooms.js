const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    roomNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    roomType: {
        type: String,
        required: true,
        enum: ['Single', 'Double', 'Suite', 'Deluxe', 'Family'],
        default: 'Single'
    },
    dailyPrice: {
        type: Number,
        required: true,
        min: 0
    },
    hourlyPrice: {
        type: Number,
        required: true,
        min: 0
    },
    minHours: {
        type: Number,
        default: 3,
        min: 1
    },
    maxOccupancy: {
        type: Number,
        required: true,
        min: 1
    },
    status: {
        type: String,
        required: true,
        enum: ['Available', 'Occupied', 'Maintenance', 'Reserved'],
        default: 'Available'
    },
    description: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
