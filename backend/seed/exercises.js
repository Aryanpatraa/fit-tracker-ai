const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Exercise = require('../models/Exercise');

// Load env vars
dotenv.config();

const exercises = [
  {
    name: 'Barbell Bench Press',
    muscleGroup: 'Chest',
    type: 'Strength',
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    description: 'A classic compound movement for building chest size and strength.',
    instructions: ['Lie on a flat bench', 'Grip barbell wider than shoulder-width', 'Lower bar to chest', 'Press bar back to starting position']
  },
  {
    name: 'Squat',
    muscleGroup: 'Legs',
    type: 'Strength',
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    description: 'The king of all leg exercises.',
    instructions: ['Stand with feet shoulder-width apart', 'Rest barbell on upper back', 'Lower body as if sitting in a chair', 'Push back up to starting position']
  },
  {
    name: 'Pull-up',
    muscleGroup: 'Back',
    type: 'Strength',
    equipment: 'Bodyweight',
    difficulty: 'Intermediate',
    description: 'Excellent exercise for developing the lats.',
    instructions: ['Grab pull-up bar with overhand grip', 'Hang with arms fully extended', 'Pull body up until chin clears bar', 'Lower back down']
  },
  {
    name: 'Dumbbell Bicep Curl',
    muscleGroup: 'Arms',
    type: 'Strength',
    equipment: 'Dumbbell',
    difficulty: 'Beginner',
    description: 'Isolation exercise targeting the biceps.',
    instructions: ['Hold dumbbells by sides', 'Keep elbows close to torso', 'Curl weights up to shoulder level', 'Slowly lower back down']
  },
  {
    name: 'Plank',
    muscleGroup: 'Core',
    type: 'Strength',
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    description: 'Isometric exercise for core strength.',
    instructions: ['Rest on forearms and toes', 'Keep body in a straight line', 'Engage core', 'Hold position']
  }
];

const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    await Exercise.deleteMany();
    await Exercise.insertMany(exercises);
    
    console.log('Exercises Imported Successfully!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

importData();
