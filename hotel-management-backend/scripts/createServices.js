const mongoose = require('mongoose');
const Service = require('../models/Service'); // Ensure this points to the correct schema file
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function createServices() {
  try {
    // Define the service data
    const services = [
      { serviceName: 'Food and Drinks', servicePrice: 200000 },
      { serviceName: 'Cleaning', servicePrice: 300000 },
      { serviceName: 'Room Reservation', servicePrice: 1000000 },
    ];

    // Insert the services into the database
    await Service.insertMany(services);
    console.log('Services created successfully');
  } catch (error) {
    console.error('Error creating services:', error);
  } finally {
    mongoose.disconnect();
  }
}

createServices();
