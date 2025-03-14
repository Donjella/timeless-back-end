const express = require('express');

const router = express.Router();
const {
  createPayment,
  getPayments,
  getPaymentById,
  updatePaymentStatus,
  deletePayment,
} = require('../controllers/paymentController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public Routes (Requires Login)
router.post('/', protect, createPayment); // Users can make a payment
router.get('/:id', protect, getPaymentById); // Users can view their payment

// Admin Routes (Requires Admin Role)
router.get('/', protect, admin, getPayments); // Admin can view all payments
router.patch('/:id', protect, admin, updatePaymentStatus); // Admin can update payment status
router.delete('/:id', protect, admin, deletePayment); // Admin can delete a payment

module.exports = router;
