const express = require('express');

const router = express.Router();
const {
  createWatch,
  getWatches,
  getWatchById,
  updateWatch,
  deleteWatch,
} = require('../controllers/watchController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getWatches);
router.get('/:id', getWatchById);

// Protected routes (Admin only)
router.post('/', protect, admin, createWatch);
router.put('/:id', protect, admin, updateWatch);
router.delete('/:id', protect, admin, deleteWatch);

module.exports = router;
