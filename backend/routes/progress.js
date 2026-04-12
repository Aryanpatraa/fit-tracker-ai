const express = require('express');
const { 
  getProgressList, 
  getProgress, 
  createProgress, 
  updateProgress, 
  deleteProgress,
  uploadProgressPhoto
} = require('../controllers/progressController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getProgressList)
  .post(createProgress);

router.route('/:id')
  .get(getProgress)
  .put(updateProgress)
  .delete(deleteProgress);

router.route('/:id/photo')
  .post(upload.single('photo'), uploadProgressPhoto);

module.exports = router;
