const asyncHandler = require('express-async-handler');
const Payment = require('../models/paymentModel');
const Rental = require('../models/rentalModel');
const {
  NotFoundError,
  ValidationError,
  ForbiddenError,
} = require('../utils/errors');

// @desc    Create a new payment
// @route   POST /api/payments
// @access  Private
const createPayment = asyncHandler(async (req, res, next) => {
  try {
    const { rental_id, amount, payment_method } = req.body;

    // Identify missing fields
    const missingFields = [];
    if (!rental_id) missingFields.push('rental_id');
    if (!amount) missingFields.push('amount');
    if (!payment_method) missingFields.push('payment_method');

    if (missingFields.length > 0) {
      throw new ValidationError(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // Ensure the rental exists
    const rental = await Rental.findById(rental_id);
    if (!rental) {
      throw new NotFoundError('Rental not found');
    }

    // Ensure user owns the rental or is an admin
    if (rental.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      throw new ForbiddenError('Not authorized to create payment for this rental');
    }

    const payment = await Payment.create({
      rental_id,
      amount,
      payment_method,
      payment_status: 'Paid',
    });

    res.status(201).json(payment);
  } catch (error) {
    next(error);
  }
});

// @desc    Get all payments
// @route   GET /api/payments
// @access  Private (Admin)
const getPayments = asyncHandler(async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      throw new ForbiddenError('Access denied. Admin only.');
    }

    const payments = await Payment.find().populate('rental_id');
    res.json(payments);
  } catch (error) {
    next(error);
  }
});

// @desc    Get payment by ID
// @route   GET /api/payments/:id
// @access  Private
const getPaymentById = asyncHandler(async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id).populate({
      path: 'rental_id',
      populate: { path: 'user' },
    });

    if (!payment) {
      throw new NotFoundError('Payment not found');
    }

    // Ensure user owns the payment's rental or is an admin
    if (payment.rental_id.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      throw new ForbiddenError('Not authorized to view this payment');
    }

    res.json(payment);
  } catch (error) {
    next(error);
  }
});

// @desc    Update payment status
// @route   PATCH /api/payments/:id
// @access  Private (Admin)
const updatePaymentStatus = asyncHandler(async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      throw new ForbiddenError('Access denied. Admin only.');
    }

    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      throw new NotFoundError('Payment not found');
    }

    payment.payment_status = req.body.payment_status || payment.payment_status;

    const updatedPayment = await payment.save();
    res.json(updatedPayment);
  } catch (error) {
    next(error);
  }
});

// @desc    Delete payment
// @route   DELETE /api/payments/:id
// @access  Private (Admin)
const deletePayment = asyncHandler(async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      throw new ForbiddenError('Access denied. Admin only.');
    }

    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      throw new NotFoundError('Payment not found');
    }

    await payment.deleteOne();
    res.json({ message: 'Payment removed' });
  } catch (error) {
    next(error);
  }
});

module.exports = {
  createPayment,
  getPayments,
  getPaymentById,
  updatePaymentStatus,
  deletePayment,
};
