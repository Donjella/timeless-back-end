const express = require('express');

const router = express.Router();
const {
  createRental,
  getRentals,
  getRentalById,
  updateRentalStatus,
  deleteRental,
} = require('../controllers/rentalController');
const { protect, admin } = require('../middleware/authMiddleware');

// User routes - require authentication
router.post('/', protect, createRental);
router.get('/:id', protect, getRentalById);

// Admin only routes
router.get('/', protect, admin, getRentals);
router.patch('/:id', protect, admin, updateRentalStatus);
router.delete('/:id', protect, admin, deleteRental);

module.exports = router;
