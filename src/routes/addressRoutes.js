const express = require('express');

const router = express.Router();
const {
  createAddress,
  getAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
} = require('../controllers/addressController');
const { protect, admin } = require('../middleware/authMiddleware');

// User routes (requires login)
router.post('/', protect, createAddress);
router.get('/:id', protect, getAddressById);
router.patch('/:id', protect, updateAddress);
router.delete('/:id', protect, deleteAddress);

// Admin route (view all addresses)
router.get('/', protect, admin, getAddresses);

module.exports = router;
