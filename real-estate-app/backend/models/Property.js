const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  propertyType: {
    type: String,
    enum: ['apartment', 'house', 'villa', 'commercial', 'plot'],
    required: true
  },
  bedrooms: {
    type: Number,
    required: true
  },
  bathrooms: {
    type: Number,
    required: true
  },
  area: {
    type: Number, // in square feet
    required: true
  },
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  zipCode: String,
  latitude: Number,
  longitude: Number,
  images: [String], // Array of image URLs
  virtualTourUrl: String,
  amenities: [String], // ['gym', 'pool', 'parking', etc]
  listingStatus: {
    type: String,
    enum: ['available', 'sold', 'rented', 'pending'],
    default: 'available'
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Property', propertySchema);
