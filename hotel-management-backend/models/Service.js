const mongoose = require("mongoose");


const serviceSchema = new mongoose.Schema(
    {
        serviceName: {
          type: String,
          required: true, // Service name is required
          trim: true, // Remove leading and trailing whitespace
          unique: true, // Ensure each service name is unique
        },
        servicePrice: {
          type: Number,
          required: true, // Service price is required
          min: 0, // Ensure price is non-negative
        },
      },
      {
        timestamps: true, // Automatically add createdAt and updatedAt fields
      }
)

const Service = mongoose.model('Service',serviceSchema);
module.exports = Service; 
