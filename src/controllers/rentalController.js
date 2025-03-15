const asyncHandler = require('express-async-handler');
const Rental = require('../models/rentalModel');
const Watch = require('../models/watchModel');
const {
  NotFoundError,
  ValidationError,
  ForbiddenError,
} = require('../utils/errors');

// @desc    Create a new rental
// @route   POST /api/rentals
// @access  Private (User)
const createRental = asyncHandler(async (req, res, next) => {
  try {
    const { watch_id, rental_days } = req.body;

    // Identify missing fields
    const missingFields = [];
    if (!watch_id) missingFields.push('watch_id');
    if (!rental_days) missingFields.push('rental_days');

    if (missingFields.length > 0) {
      throw new ValidationError(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // Ensure the watch exists
    const watch = await Watch.findById(watch_id);
    if (!watch) {
      throw new NotFoundError('Watch not found');
    }

    // Ensure watch is available
    if (watch.quantity < 1) {
      throw new ValidationError('Watch is out of stock');
    }

    // Calculate total rental price
    const total_price = watch.rental_day_price * rental_days;

    // Create new rental
    const rental = await Rental.create({
      user: req.user._id, // Associate rental with logged-in user
      watch: watch_id,
      rental_days,
      total_price,
      rental_status: 'Pending',
    });

    // Reduce available watch quantity
    watch.quantity -= 1;
    await watch.save();

    res.status(201).json(rental);
  } catch (error) {
    next(error);
  }
});

// @desc    Get all rentals (Admin only)
// @route   GET /api/rentals
// @access  Private (Admin)
const getRentals = asyncHandler(async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      throw new ForbiddenError('Access denied. Admin only.');
    }

    const rentals = await Rental.find()
      .populate('user', 'first_name last_name email')
      .populate('watch', 'model year brand');

    res.json(rentals);
  } catch (error) {
    next(error);
  }
});

// @desc    Get rental by ID
// @route   GET /api/rentals/:id
// @access  Private (User/Admin)
const getRentalById = asyncHandler(async (req, res, next) => {
  try {
    const rental = await Rental.findById(req.params.id)
      .populate('user', 'first_name last_name email')
      .populate('watch', 'model year brand');

    if (!rental) {
      throw new NotFoundError('Rental not found');
    }

    // Ensure user owns the rental or is an admin
    if (rental.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      throw new ForbiddenError('Not authorized to view this rental');
    }

    res.json(rental);
  } catch (error) {
    next(error);
  }
});

// @desc    Update rental status
// @route   PATCH /api/rentals/:id
// @access  Private (Admin)
const updateRentalStatus = asyncHandler(async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      throw new ForbiddenError('Access denied. Admin only.');
    }

    const rental = await Rental.findById(req.params.id);

    if (!rental) {
      throw new NotFoundError('Rental not found');
    }

    rental.rental_status = req.body.rental_status || rental.rental_status;
    const updatedRental = await rental.save();

    res.json(updatedRental);
  } catch (error) {
    next(error);
  }
});

// @desc    Delete a rental (Admin only)
// @route   DELETE /api/rentals/:id
// @access  Private (Admin)
const deleteRental = asyncHandler(async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      throw new ForbiddenError('Access denied. Admin only.');
    }

    const rental = await Rental.findById(req.params.id);

    if (!rental) {
      throw new NotFoundError('Rental not found');
    }

    // Restore watch quantity before deleting rental
    const watch = await Watch.findById(rental.watch);
    if (watch) {
      watch.quantity += 1;
      await watch.save();
    }

    await rental.deleteOne();
    res.json({ message: 'Rental deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = {
  createRental,
  getRentals,
  getRentalById,
  updateRentalStatus,
  deleteRental,
};
