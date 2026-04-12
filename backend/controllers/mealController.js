const Meal = require('../models/Meal');

// @desc    Get all meals
// @route   GET /api/meals
// @access  Private
exports.getMeals = async (req, res, next) => {
  try {
    const meals = await Meal.find({ user: req.user.id }).sort('-date');
    res.status(200).json({ success: true, count: meals.length, data: meals });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single meal
// @route   GET /api/meals/:id
// @access  Private
exports.getMeal = async (req, res, next) => {
  try {
    const meal = await Meal.findById(req.params.id);

    if (!meal || meal.user.toString() !== req.user.id) {
      return res.status(404).json({ success: false, error: 'Meal not found' });
    }

    res.status(200).json({ success: true, data: meal });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new meal
// @route   POST /api/meals
// @access  Private
exports.createMeal = async (req, res, next) => {
  try {
    req.body.user = req.user.id;
    const meal = await Meal.create(req.body);

    res.status(201).json({ success: true, data: meal });
  } catch (err) {
    next(err);
  }
};

// @desc    Update meal
// @route   PUT /api/meals/:id
// @access  Private
exports.updateMeal = async (req, res, next) => {
  try {
    let meal = await Meal.findById(req.params.id);

    if (!meal || meal.user.toString() !== req.user.id) {
      return res.status(404).json({ success: false, error: 'Meal not found' });
    }

    meal = await Meal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: meal });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete meal
// @route   DELETE /api/meals/:id
// @access  Private
exports.deleteMeal = async (req, res, next) => {
  try {
    const meal = await Meal.findById(req.params.id);

    if (!meal || meal.user.toString() !== req.user.id) {
      return res.status(404).json({ success: false, error: 'Meal not found' });
    }

    await meal.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};
