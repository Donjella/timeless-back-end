const express = require('express');
const router = express.Router();

const { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  updateUserProfile 
} = require('../controllers/userController');

const { protect } = require('../middleware/authMiddleware');

// ✅ Fix: Change '/' to '/register' for user registration
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

module.exports = router;
