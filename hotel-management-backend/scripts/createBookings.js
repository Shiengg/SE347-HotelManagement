const mongoose = require("mongoose");
const Booking = require("../models/Booking"); // Ensure this path is correct
const User = require("../models/User"); // Ensure User model is set up
const Room = require("../models/Rooms"); // Ensure Room model is set up
const Service = require("../models/Service"); // Ensure Service model is set up
const Invoice = require("../models/Invoice"); // Ensure Invoice model is set up
const RestaurantItem = require("../models/Restaurant");
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
    const receptionist = await User.findOne({
      role_id: "6783da9402236e8ab00f4fee",
    }); // Example query
    const rooms = await Room.find(); // Example to get all rooms
    const services = await Service.find(); // Example to get all services
    const restaurantItems = await RestaurantItem.find();

    const bookingStatus = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];

    const checkInDate = new Date("2025-01-25");
    const checkOutDate = new Date("2025-01-30");

    // Calculate totalDays (difference in days)
    const totalDays = Math.floor(
      (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)
    );

    // Calculate totalHours (difference in hours)
    const totalHours = Math.floor(
      (checkOutDate - checkInDate) / (1000 * 60 * 60)
    );

    const bookingType = Math.random()<0.5?"Hourly":"Daily"

    if (
      !customers.length ||
      !receptionist ||
      rooms.length === 0 ||
      services.length === 0
    ) {
      throw new Error(
        "Required references (customers, receptionist, rooms, or services) are missing."
      );
    }

    // Generate bookings and invoices for every customer and every room
    for (const customer of customers) {
      for (const room of rooms) {
        let   totalServicePrice = 0;
        // Calculate total price based on services
        const servicesWithTotalPrice = services.map((service) => {
          const quantity = Math.floor(Math.random() * 5) + 1; // Random quantity between 1 and 5
          totalServicePrice+=service.serviceName==="Room Reservation"?(bookingType==="Hourly"?room.hourlyPrice*totalHours:room.dailyPrice*totalDays):service.servicePrice*quantity;
          return {
            serviceID: service._id,
            quantity,
          };
        });


        const bookingData = {
          customerID: customer._id,
          receptionistID: receptionist._id,
          roomID: room._id,
          bookingType,
          checkInDate: checkInDate,
          checkOutDate: checkOutDate,
          totalDays: totalDays,
          totalHours: totalHours,
          totalPrice: totalServicePrice, // Sum of all services
          services: servicesWithTotalPrice,
          status: bookingStatus[Math.floor((Math.random()*3))], // Default status
          
        };

        const booking = new Booking(bookingData);
        await booking.save();

        console.log("Booking created successfully:");

        // Randomize payment method and payment status
        const paymentMethod =
         Math.random() < 0.5 ? "Cash" : "Card"
        const paymentStatus = Math.random() < 0.5 ? "Paid" : "Unpaid"; // 50% chance of being true or false

        // Randomize ordered items
        const numOfItems = Math.floor(Math.random() * 3) + 1; // Randomize number of items (1-3)
        const orderedItems = [];
        for (let i = 0; i < numOfItems; i++) {
          const randomItem = restaurantItems[Math.floor(Math.random() * restaurantItems.length)];
          const quantity = Math.floor(Math.random() * 3) + 1; // Random quantity (1-3)
          const total = randomItem.price * quantity;

          orderedItems.push({
            itemId: randomItem._id,
            name: randomItem.name,
            category:randomItem.category,
            quantity,
            price: randomItem.price,
            total,
          });

        }

        const totalOrderedItemsPrice = orderedItems.reduce((sum, item) => sum + item.total, 0);

        // Create invoice for the booking
        const invoiceData = {
          bookingID: booking._id,
          customerID: customer._id,
          totalAmount: booking.totalPrice + totalOrderedItemsPrice, // Use the total price from the booking
          paymentMethod,
          paymentStatus,
          orderedItems,
          orderedAt:new Date() // Add ordered items
        };

        const invoice = new Invoice(invoiceData);
        await invoice.save();

        console.log("Invoice created successfully:");

        booking.invoice = invoice._id;
        await booking.save();

        console.log("Booking updated with invoice reference.");
      }
    }
  } catch (error) {
    console.error("Error creating bookings and invoices:", error.message);
  } finally {
    mongoose.disconnect();
  }
}

createBookingsAndInvoices();
