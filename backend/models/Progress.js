const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  weight: {
    type: Number, // in kg
    required: true
  },
  bodyFatPercentage: {
    type: Number
  },
  measurements: {
    chest: Number,
    waist: Number,
    hips: Number,
    biceps: Number,
    thighs: Number
  },
  photoUrl: {
    type: String, // Path to uploaded photo
  },
  notes: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Progress', progressSchema);
