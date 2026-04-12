const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add an exercise name'],
    trim: true,
    unique: true
  },
  muscleGroup: {
    type: String,
    enum: ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Cardio', 'Full Body'],
    required: [true, 'Please specify a muscle group']
  },
  type: {
    type: String,
    enum: ['Strength', 'Cardio', 'Flexibility'],
    default: 'Strength'
  },
  equipment: {
    type: String,
    enum: ['Barbell', 'Dumbbell', 'Machine', 'Cable', 'Bodyweight', 'Kettlebell', 'Band', 'Other'],
    default: 'Other'
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  description: String,
  instructions: [String]
});

module.exports = mongoose.model('Exercise', exerciseSchema);
