const mongoose = require("mongoose");
const Booking = require("./Booking");

const invoiceSchema = new mongoose.Schema(
  {
    bookingID: {
      type: mongoose.Types.ObjectId, // Use ObjectId to reference another document
      ref: Booking, // Reference the Booking collection
      required: true,
      unique: true,
      trim: true,
    },
    totalAmount: {
      type: Number,
      min: 0,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["Cash", "CreditCard", "DebitCard"],
      default: "Cash",
    },
    paymentStatus: {
      type: Boolean,
      default: false,
    },
    paymentDate: {
      type: Date,
      default: () => new Date(),
    },
  },
  {
    timestamps: true,
  }
);

invoiceSchema.index({ bookingID: 1 }, { unique: true });

const Invoice = mongoose.model("Invoice", invoiceSchema);

module.exports = Invoice;
