const mongoose = require("mongoose");
const Booking = require("../models/Booking"); // Ensure this path is correct
const User = require("../models/User"); // Ensure User model is set up
const Room = require("../models/Rooms"); // Ensure Room model is set up
const Service = require("../models/Service"); // Ensure Service model is set up
const Invoice = require("../models/Invoice"); // Ensure Invoice model is set up
require("dotenv").config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function createBookingsAndInvoices() {
  try {
    console.log("Connecting to MongoDB...");

    // Fetch or create customers, receptionist, rooms, and services
    const customers = await User.find({ role_id: "6783daa202236e8ab00f4ff0" }); // Example query
    const receptionist = await User.findOne({ role_id: "6783da9402236e8ab00f4fee" }); // Example query
    const rooms = await Room.find(); // Example to get all rooms
    const services = await Service.find(); // Example to get all services

    if (!customers.length || !receptionist || rooms.length === 0 || services.length === 0) {
      throw new Error("Required references (customers, receptionist, rooms, or services) are missing.");
    }

    // Generate bookings and invoices for every customer and every room
    for (const customer of customers) {
      for (const room of rooms) {
        // Calculate total price based on services
        const servicesWithTotalPrice = services.map(service => {
          const quantity = Math.floor(Math.random() * 5) + 1; // Random quantity between 1 and 5
          const totalPrice = service.servicePrice * quantity;
          return {
            serviceID: service._id,
            quantity,
            totalPrice,
          };
        });

        const totalServicePrice = servicesWithTotalPrice.reduce((sum, service) => sum + service.totalPrice, 0);

        const bookingData = {
          customerID: customer._id,
          receptionistID: receptionist._id,
          roomID: room._id,
          checkInDate: new Date("2025-01-25"),
          checkOutDate: new Date("2025-01-30"),
          totalPrice: totalServicePrice, // Sum of all services
          services: servicesWithTotalPrice,
          status: "Pending", // Default status
        };

        const booking = new Booking(bookingData);
        await booking.save();

        console.log("Booking created successfully:");

        // Randomize payment method and payment status
        const paymentMethods = ["Cash", "CreditCard", "DebitCard"];
        const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
        const paymentStatus = Math.random() < 0.5; // 50% chance of being true or false

        // Create invoice for the booking
        const invoiceData = {
          bookingID: booking._id,
          totalAmount: booking.totalPrice, // Use the total price from the booking
          paymentMethod,
          paymentStatus,
        };

        const invoice = new Invoice(invoiceData);
        await invoice.save();

        console.log("Invoice created successfully:");
      }
    }
  } catch (error) {
    console.error("Error creating bookings and invoices:", error.message);
  } finally {
    mongoose.disconnect();
  }
}

createBookingsAndInvoices();
