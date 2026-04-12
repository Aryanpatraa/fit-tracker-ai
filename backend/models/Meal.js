const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
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
  mealType: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner', 'snack'],
    required: true
  },
  foods: [{
    name: { type: String, required: true },
    calories: { type: Number, required: true },
    protein: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fats: { type: Number, required: true },
    servingSize: { type: Number, required: true },
    servingUnit: { type: String, required: true }
  }],
  totalCalories: { type: Number, default: 0 },
  totalProtein: { type: Number, default: 0 },
  totalCarbs: { type: Number, default: 0 },
  totalFats: { type: Number, default: 0 }
}, { timestamps: true });

// Pre-save hook to calculate totals
mealSchema.pre('save', function(next) {
  this.totalCalories = this.foods.reduce((acc, food) => acc + food.calories, 0);
  this.totalProtein = this.foods.reduce((acc, food) => acc + food.protein, 0);
  this.totalCarbs = this.foods.reduce((acc, food) => acc + food.carbs, 0);
  this.totalFats = this.foods.reduce((acc, food) => acc + food.fats, 0);
  next();
});

module.exports = mongoose.model('Meal', mealSchema);
