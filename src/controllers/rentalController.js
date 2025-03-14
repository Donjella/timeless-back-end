const asyncHandler = require('express-async-handler');
const Rental = require('../models/rentalModel');
const Watch = require('../models/watchModel');

// @desc    Create a new rental
// @route   POST /api/rentals
// @access  Private (User)
const createRental = asyncHandler(async (req, res) => {
  const { watch_id, rental_days } = req.body;

  if (!watch_id || !rental_days) {
    res.status(400);
    throw new Error('All fields are required');
  }

  // Ensure the watch exists
  const watch = await Watch.findById(watch_id);
  if (!watch) {
    res.status(404);
    throw new Error('Watch not found');
  }

  // Ensure watch is available
  if (watch.quantity < 1) {
    res.status(400);
    throw new Error('Watch is out of stock');
  }

  // Calculate total rental price
  const total_price = watch.rental_day_price * rental_days;

  // Create new rental
  const rental = await Rental.create({
    user: req.user.id, // Associate rental with logged-in user
    watch: watch_id,
    rental_days,
    total_price,
    rental_status: 'Pending',
  });

  // Reduce available watch quantity
  watch.quantity -= 1;
  await watch.save();

  res.status(201).json(rental);
});

// @desc    Get all rentals (Admin only)
// @route   GET /api/rentals
// @access  Private (Admin)
const getRentals = asyncHandler(async (req, res) => {
  const rentals = await Rental.find()
    .populate('user', 'first_name last_name email')
    .populate('watch', 'model year brand');
  res.json(rentals);
});

// @desc    Get rental by ID
// @route   GET /api/rentals/:id
// @access  Private (User/Admin)
const getRentalById = asyncHandler(async (req, res) => {
  const rental = await Rental.findById(req.params.id)
    .populate('user', 'first_name last_name email')
    .populate('watch', 'model year brand');

  if (!rental) {
    res.status(404);
    throw new Error('Rental not found');
  }

  // Ensure user owns the rental or is an admin
  if (rental.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to view this rental');
  }

  res.json(rental);
});

// @desc    Update rental status
// @route   PATCH /api/rentals/:id
// @access  Private (Admin)
const updateRentalStatus = asyncHandler(async (req, res) => {
  const rental = await Rental.findById(req.params.id);

  if (!rental) {
    res.status(404);
    throw new Error('Rental not found');
  }

  rental.rental_status = req.body.rental_status || rental.rental_status;
  const updatedRental = await rental.save();

  res.json(updatedRental);
});

// @desc    Delete a rental (Admin only)
// @route   DELETE /api/rentals/:id
// @access  Private (Admin)
const deleteRental = asyncHandler(async (req, res) => {
  const rental = await Rental.findById(req.params.id);

  if (!rental) {
    res.status(404);
    throw new Error('Rental not found');
  }

  // Restore watch quantity before deleting rental
  const watch = await Watch.findById(rental.watch);
  if (watch) {
    watch.quantity += 1;
    await watch.save();
  }

  await rental.deleteOne();
  res.json({ message: 'Rental deleted successfully' });
});

module.exports = {
  createRental,
  getRentals,
  getRentalById,
  updateRentalStatus,
  deleteRental,
};
