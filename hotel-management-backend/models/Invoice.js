const mongoose = require("mongoose");
const Booking = require("./Booking");

const orderedItemSchema = new mongoose.Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RestaurantItem",
    required: true
  },
  name: String,
  category: String,
  quantity: Number,
  price: Number,
  total: Number,
  orderedAt: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const invoiceSchema = new mongoose.Schema(
  {
    bookingID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    customerID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    roomCharges: {
      type: Number,
      default: 0
    },
    serviceCharges: {
      type: Number,
      default: 0
    },
    restaurantCharges: {
      type: Number,
      default: 0
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentStatus: {
      type: String,
      enum: ["Unpaid", "Paid"],
      default: "Unpaid",
    },
    paymentMethod: {
      type: String,
      enum: ["Cash", "Card", null],
      default: null,
    },
    paymentDate: {
      type: Date,
      default: null,
    },
    orderedItems: [orderedItemSchema],
  },
  {
    timestamps: true,
  }
);

invoiceSchema.index({ bookingID: 1 }, { unique: true });

const Invoice = mongoose.model("Invoice", invoiceSchema);

module.exports = Invoice;
