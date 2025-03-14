const express = require('express');

const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  updateUserRole,
  getUsers,
  getUserById,
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/profile', protect, getUserProfile);
router.patch('/profile', protect, updateUserProfile);

// Admin only routes
router.get('/', protect, admin, getUsers); // Get all users
router.get('/:id', protect, admin, getUserById); // Get user by ID
router.patch('/role/:id', protect, admin, updateUserRole); // Update user role

module.exports = router;
