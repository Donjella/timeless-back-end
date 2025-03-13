const express = require('express');
const router = express.Router();
const { 
  createWatch, 
  getWatches, 
  getWatchById, 
  updateWatch, 
  deleteWatch 
} = require('../controllers/watchController');

// Middleware will be added later for protected routes
// const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getWatches);
router.get('/:id', getWatchById);

// Protected routes (Admin only) - commented out until auth middleware is implemented
// router.post('/', protect, admin, createWatch);
// router.put('/:id', protect, admin, updateWatch);
// router.delete('/:id', protect, admin, deleteWatch);

// Temporary versions without auth for development
router.post('/', createWatch);
router.put('/:id', updateWatch);
router.delete('/:id', deleteWatch);

module.exports = router;