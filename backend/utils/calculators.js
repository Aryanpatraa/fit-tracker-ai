// Calculate BMR using Mifflin-St Jeor Equation
// gender: 'male' | 'female'
// weight: in kg
// height: in cm
// age: in years
const calculateBMR = (gender, weight, height, age) => {
  if (gender === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
};

// Calculate TDEE (Total Daily Energy Expenditure)
// activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
const activityMultipliers = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9
};

const calculateTDEE = (bmr, activityLevel) => {
  const multiplier = activityMultipliers[activityLevel] || 1.2;
  return bmr * multiplier;
};

// Calculate Macros based on goal
// goal: 'lose_weight' | 'maintain' | 'build_muscle'
const calculateMacros = (tdee, goal, weight) => {
  let targetCalories = tdee;
  
  if (goal === 'lose_weight') {
    targetCalories -= 500; // 500 calorie deficit
  } else if (goal === 'build_muscle') {
    targetCalories += 300; // 300 calorie surplus
  }

  // General guideline macros
  // Protein: ~2g per kg of bodyweight for muscle maintenance/growth
  const proteinGrams = weight * 2;
  const proteinCalories = proteinGrams * 4;
  
  // Fats: ~25% of total calories
  const fatCalories = targetCalories * 0.25;
  const fatGrams = fatCalories / 9;

  // Carbs: Remaining calories
  const carbCalories = targetCalories - proteinCalories - fatCalories;
  const carbGrams = carbCalories / 4;

  return {
    targetCalories: Math.round(targetCalories),
    protein: Math.round(proteinGrams),
    carbs: Math.round(carbGrams),
    fats: Math.round(fatGrams)
  };
};

module.exports = {
  calculateBMR,
  calculateTDEE,
  calculateMacros
};
