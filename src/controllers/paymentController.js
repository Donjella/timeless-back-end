const asyncHandler = require('express-async-handler');
const Payment = require('../models/paymentModel');
const Rental = require('../models/rentalModel');

// @desc    Create a new payment
// @route   POST /api/payments
// @access  Private
const createPayment = asyncHandler(async (req, res) => {
  const { rental_id, amount, payment_method } = req.body;

  if (!rental_id || !amount || !payment_method) {
    res.status(400);
    throw new Error('All fields are required');
  }

  // Ensure the rental exists
  const rental = await Rental.findById(rental_id);
  if (!rental) {
    res.status(404);
    throw new Error('Rental not found');
  }

  const payment = await Payment.create({
    rental_id,
    amount,
    payment_method,
    payment_status: 'Paid',
  });

  res.status(201).json(payment);
});

// @desc    Get all payments
// @route   GET /api/payments
// @access  Private (Admin)
const getPayments = asyncHandler(async (req, res) => {
  const payments = await Payment.find().populate('rental_id');
  res.json(payments);
});

// @desc    Get payment by ID
// @route   GET /api/payments/:id
// @access  Private
const getPaymentById = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.id).populate('rental_id');

  if (payment) {
    res.json(payment);
  } else {
    res.status(404);
    throw new Error('Payment not found');
  }
});

// @desc    Update payment status
// @route   PATCH /api/payments/:id
// @access  Private (Admin)
const updatePaymentStatus = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.id);

  if (!payment) {
    res.status(404);
    throw new Error('Payment not found');
  }

  payment.payment_status = req.body.payment_status || payment.payment_status;

  const updatedPayment = await payment.save();
  res.json(updatedPayment);
});

// @desc    Delete payment
// @route   DELETE /api/payments/:id
// @access  Private (Admin)
const deletePayment = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.id);

  if (!payment) {
    res.status(404);
    throw new Error('Payment not found');
  }

  await payment.deleteOne();
  res.json({ message: 'Payment removed' });
});

module.exports = {
  createPayment,
  getPayments,
  getPaymentById,
  updatePaymentStatus,
  deletePayment,
};
