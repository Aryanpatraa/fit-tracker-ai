const Workout = require('../models/Workout');

// @desc    Get all workouts
// @route   GET /api/workouts
// @access  Private
exports.getWorkouts = async (req, res, next) => {
  try {
    const workouts = await Workout.find({ user: req.user.id }).sort('-date');
    res.status(200).json({ success: true, count: workouts.length, data: workouts });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single workout
// @route   GET /api/workouts/:id
// @access  Private
exports.getWorkout = async (req, res, next) => {
  try {
    const workout = await Workout.findById(req.params.id);

    if (!workout || workout.user.toString() !== req.user.id) {
      return res.status(404).json({ success: false, error: 'Workout not found' });
    }

    res.status(200).json({ success: true, data: workout });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new workout
// @route   POST /api/workouts
// @access  Private
exports.createWorkout = async (req, res, next) => {
  try {
    req.body.user = req.user.id;
    const workout = await Workout.create(req.body);

    res.status(201).json({ success: true, data: workout });
  } catch (err) {
    next(err);
  }
};

// @desc    Update workout
// @route   PUT /api/workouts/:id
// @access  Private
exports.updateWorkout = async (req, res, next) => {
  try {
    let workout = await Workout.findById(req.params.id);

    if (!workout || workout.user.toString() !== req.user.id) {
      return res.status(404).json({ success: false, error: 'Workout not found' });
    }

    workout = await Workout.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: workout });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete workout
// @route   DELETE /api/workouts/:id
// @access  Private
exports.deleteWorkout = async (req, res, next) => {
  try {
    const workout = await Workout.findById(req.params.id);

    if (!workout || workout.user.toString() !== req.user.id) {
      return res.status(404).json({ success: false, error: 'Workout not found' });
    }

    await workout.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};
