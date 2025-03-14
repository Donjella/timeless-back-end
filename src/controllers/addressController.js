const Address = require("../models/addressModel");
const asyncHandler = require("express-async-handler");

// @desc    Create a new address
// @route   POST /api/addresses
// @access  Private (User)
const createAddress = asyncHandler(async (req, res) => {
  const { street, city, state, postal_code, country } = req.body;

  if (!street || !city || !state || !postal_code || !country) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const address = await Address.create({
    user: req.user.id, // Associate address with the logged-in user
    street,
    city,
    state,
    postal_code,
    country,
  });

  res.status(201).json(address);
});

// @desc    Get all addresses (Admin only)
// @route   GET /api/addresses
// @access  Private (Admin)
const getAddresses = asyncHandler(async (req, res) => {
  const addresses = await Address.find().populate("user", "name email");
  res.json(addresses);
});

// @desc    Get address by ID
// @route   GET /api/addresses/:id
// @access  Private (User)
const getAddressById = asyncHandler(async (req, res) => {
  const address = await Address.findById(req.params.id).populate("user", "name email");

  if (!address) {
    res.status(404);
    throw new Error("Address not found");
  }

  res.json(address);
});

// @desc    Update an address
// @route   PATCH /api/addresses/:id
// @access  Private (User)
const updateAddress = asyncHandler(async (req, res) => {
  const address = await Address.findById(req.params.id);

  if (!address) {
    res.status(404);
    throw new Error("Address not found");
  }

  if (address.user.toString() !== req.user.id && req.user.role !== "admin") {
    res.status(401);
    throw new Error("Not authorized to update this address");
  }

  const updatedFields = req.body;
  Object.assign(address, updatedFields);
  await address.save();

  res.json(address);
});

// @desc    Delete an address
// @route   DELETE /api/addresses/:id
// @access  Private (User)
const deleteAddress = asyncHandler(async (req, res) => {
  const address = await Address.findById(req.params.id);

  if (!address) {
    res.status(404);
    throw new Error("Address not found");
  }

  if (address.user.toString() !== req.user.id && req.user.role !== "admin") {
    res.status(401);
    throw new Error("Not authorized to delete this address");
  }

  await address.deleteOne();
  res.json({ message: "Address deleted" });
});

module.exports = {
  createAddress,
  getAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
};
