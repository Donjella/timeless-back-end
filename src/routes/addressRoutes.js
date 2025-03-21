const express = require('express');

const router = express.Router();
const {
  createAddress,
  getAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
  updateUserAddress,
} = require('../controllers/addressController');
const { protect, admin } = require('../middleware/authMiddleware');

// Authenticated User Routes (Requires Login)
router.post('/', protect, createAddress);
router.get('/:id', protect, getAddressById);
router.patch('/:id', protect, updateAddress);
router.delete('/:id', protect, deleteAddress);
router.patch('/user', protect, updateUserAddress);

// Admin Only Routes (Requires Admin Role)
router.get('/', protect, admin, getAddresses); // Admin can view all addresses

module.exports = router;
