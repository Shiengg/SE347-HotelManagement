const mongoose = require('mongoose');

const restaurantItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  description: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['Food', 'Beverage', 'Dessert'],
    default: 'Food'
  },
  image: {
    type: String,  // URL của ảnh
    default: ''
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

restaurantItemSchema.index({ name: 1 }, { unique: true });

const RestaurantItem = mongoose.model('RestaurantItem', restaurantItemSchema);
module.exports = RestaurantItem; 