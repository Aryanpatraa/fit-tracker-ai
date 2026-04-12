const Progress = require('../models/Progress');
const path = require('path');

// @desc    Get all progress logs
// @route   GET /api/progress
// @access  Private
exports.getProgressList = async (req, res, next) => {
  try {
    const progressList = await Progress.find({ user: req.user.id }).sort('-date');
    res.status(200).json({ success: true, count: progressList.length, data: progressList });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single progress log
// @route   GET /api/progress/:id
// @access  Private
exports.getProgress = async (req, res, next) => {
  try {
    const progress = await Progress.findById(req.params.id);

    if (!progress || progress.user.toString() !== req.user.id) {
      return res.status(404).json({ success: false, error: 'Progress log not found' });
    }

    res.status(200).json({ success: true, data: progress });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new progress log
// @route   POST /api/progress
// @access  Private
exports.createProgress = async (req, res, next) => {
  try {
    req.body.user = req.user.id;
    const progress = await Progress.create(req.body);

    res.status(201).json({ success: true, data: progress });
  } catch (err) {
    next(err);
  }
};

// @desc    Update progress log
// @route   PUT /api/progress/:id
// @access  Private
exports.updateProgress = async (req, res, next) => {
  try {
    let progress = await Progress.findById(req.params.id);

    if (!progress || progress.user.toString() !== req.user.id) {
      return res.status(404).json({ success: false, error: 'Progress log not found' });
    }

    progress = await Progress.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: progress });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete progress log
// @route   DELETE /api/progress/:id
// @access  Private
exports.deleteProgress = async (req, res, next) => {
  try {
    const progress = await Progress.findById(req.params.id);

    if (!progress || progress.user.toString() !== req.user.id) {
      return res.status(404).json({ success: false, error: 'Progress log not found' });
    }

    await progress.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};

// @desc    Upload progress photo
// @route   POST /api/progress/:id/photo
// @access  Private
exports.uploadProgressPhoto = async (req, res, next) => {
  try {
    const progress = await Progress.findById(req.params.id);

    if (!progress || progress.user.toString() !== req.user.id) {
      return res.status(404).json({ success: false, error: 'Progress log not found' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Please upload a file' });
    }

    // Relative path for the front-end to access via static server
    const photoUrl = `/uploads/${req.file.filename}`;

    const updatedProgress = await Progress.findByIdAndUpdate(req.params.id, { photoUrl }, { new: true });

    res.status(200).json({
      success: true,
      data: updatedProgress
    });
  } catch (err) {
    next(err);
  }
};
