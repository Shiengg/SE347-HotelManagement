const mongoose = require("mongoose");
const Booking = require("./Booking");

const orderItemSchema = new mongoose.Schema({
  itemId: String,
  name: String,
  category:String,
  quantity: Number,
  price: Number,
  total: Number,
  orderedAt: {
    type: Date,
    default: Date.now
  }
});

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
      enum: ["Cash", "Card"],
      default: null,
    },
    paymentDate: {
      type: Date,
      default: null,
    },
    orderedItems: [orderItemSchema],
  },
  {
    timestamps: true,
  }
);

invoiceSchema.index({ bookingID: 1 }, { unique: true });

const Invoice = mongoose.model("Invoice", invoiceSchema);

module.exports = Invoice;
