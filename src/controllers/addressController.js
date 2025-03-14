const asyncHandler = require('express-async-handler');
const Address = require('../models/addressModel');

// @desc    Create a new address
// @route   POST /api/addresses
// @access  Private (User)
const createAddress = asyncHandler(async (req, res) => {
  const {
    street_address, suburb, state, postcode,
  } = req.body;

  if (!street_address || !suburb || !state || !postcode) {
    res.status(400);
    throw new Error('All fields are required');
  }

  const address = await Address.create({
    street_address, suburb, state, postcode,
  });

  res.status(201).json(address);
});

// @desc    Get all addresses (Admin only)
// @route   GET /api/addresses
// @access  Private (Admin)
const getAddresses = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Access denied. Admin only.');
  }

  const addresses = await Address.find();
  res.json(addresses);
});

// @desc    Get address by ID
// @route   GET /api/addresses/:id
// @access  Private (User)
const getAddressById = asyncHandler(async (req, res) => {
  const address = await Address.findById(req.params.id);

  if (!address) {
    res.status(404);
    throw new Error('Address not found');
  }

  res.json(address);
});

// @desc    Update an address (Admin only)
// @route   PATCH /api/addresses/:id
// @access  Private (Admin)
const updateAddress = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Access denied. Admin only.');
  }

  const address = await Address.findById(req.params.id);
  if (!address) {
    res.status(404);
    throw new Error('Address not found');
  }

  Object.assign(address, req.body);
  await address.save();

  res.json(address);
});

// @desc    Delete an address (Admin only)
// @route   DELETE /api/addresses/:id
// @access  Private (Admin)
const deleteAddress = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Access denied. Admin only.');
  }

  const address = await Address.findById(req.params.id);
  if (!address) {
    res.status(404);
    throw new Error('Address not found');
  }

  await address.deleteOne();
  res.json({ message: 'Address deleted successfully' });
});

module.exports = {
  createAddress,
  getAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
};
