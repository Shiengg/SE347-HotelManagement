const mongoose = require("mongoose");
const User = require("./User");
const Room = require("./Rooms");
const Service = require("./Service");

const bookingSchema = new mongoose.Schema(
  {
    customerID: {
      type: mongoose.Types.ObjectId,
      ref: User,
      required: true,
      trim: true,
    },
    receptionistID: {
      type: mongoose.Types.ObjectId,
      ref: User,
      required: true,
      trim: true,
    },
    roomID: {
      type: mongoose.Types.ObjectId,
      ref: Room,
      required: true,
      trim: true,
    },
    checkInDate: {
      type: Date,
      required: true, // Ensure a check-in date is provided
    },
    checkOutDate: {
      type: Date,
      required: true, // Ensure a check-out date is provided
    },
    totalPrice: {
      type: Number,
      required: true, // Ensure the total price is provided
      min: 0, // Price must be non-negative
    },
    services: [
      {
        serviceID: {
          type: mongoose.Types.ObjectId, // Reference to the Service model
          ref: Service,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        totalPrice: {
          type: Number,
          required: true, // Ensure the total price is provided
          min: 0, // Price must be non-negative
        }
      },
    ],
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled"], // Define allowed statuses
      default: "Pending", // Default to "Pending"
    },
  },
  {
    timestamps: true,
  }
);

bookingSchema.index(
  { customerID: 1, roomID: 1, checkInDate: 1 },
  { unique: true }
);

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
