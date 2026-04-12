const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please add a workout name']
  },
  date: {
    type: Date,
    default: Date.now
  },
  duration: {
    type: Number, // in minutes
    required: false
  },
  exercises: [{
    exercise: {
      type: mongoose.Schema.ObjectId,
      ref: 'Exercise'
    },
    name: String, // fallback if not referenced from db
    sets: [{
      reps: { type: Number, required: true },
      weight: { type: Number, required: true },
      completed: { type: Boolean, default: false }
    }]
  }],
  notes: {
    type: String,
    maxlength: 500
  },
  completed: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Workout', workoutSchema);
