const asyncHandler = require('express-async-handler');
const Address = require('../models/addressModel');
const User = require('../models/userModel');
const {
  NotFoundError,
  ValidationError,
  ForbiddenError,
} = require('../utils/errors');

// @desc    Create a new address
// @route   POST /api/addresses
// @access  Private (User)
const createAddress = asyncHandler(async (req, res, next) => {
  try {
    const {
      street_address, suburb, state, postcode,
    } = req.body;

    // Identify missing fields
    const missingFields = [];
    if (!street_address) missingFields.push('street_address');
    if (!suburb) missingFields.push('suburb');
    if (!state) missingFields.push('state');
    if (!postcode) missingFields.push('postcode');

    if (missingFields.length > 0) {
      throw new ValidationError(`Missing required fields: ${missingFields.join(', ')}`);
    }

    const address = await Address.create({
      street_address, suburb, state, postcode,
    });

    res.status(201).json(address);
  } catch (error) {
    next(error);
  }
});

// @desc    Get all addresses (Admin only)
// @route   GET /api/addresses
// @access  Private (Admin)
const getAddresses = asyncHandler(async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      throw new ForbiddenError('Access denied. Admin only.');
    }

    const addresses = await Address.find();
    res.json(addresses);
  } catch (error) {
    next(error);
  }
});

// @desc    Partially Update User's Address
// @route   PATCH /api/users/address
// @access  Private (Authenticated User)
const updateUserAddress = asyncHandler(async (req, res, next) => {
  try {
    // Find the user
    const user = await User.findById(req.user.id);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // If user doesn't have an address, create a new one
    if (!user.address) {
      const newAddress = await Address.create(req.body);
      user.address = newAddress._id;
      await user.save();
      return res.json(newAddress);
    }

    // Find existing address
    const address = await Address.findById(user.address);
    if (!address) {
      throw new NotFoundError('Address not found');
    }

    // Perform partial update
    Object.keys(req.body).forEach((key) => {
      if (['street_address', 'suburb', 'state', 'postcode'].includes(key)) {
        address[key] = req.body[key];
      }
    });

    // Save updated address
    await address.save();

    res.json(address);
  } catch (error) {
    next(error);
  }
});

// Export the new method
module.exports = { updateUserAddress };
// @desc    Get address by ID
// @route   GET /api/addresses/:id
// @access  Private (User)
const getAddressById = asyncHandler(async (req, res, next) => {
  try {
    const address = await Address.findById(req.params.id);

    if (!address) {
      throw new NotFoundError('Address not found');
    }

    res.json(address);
  } catch (error) {
    next(error);
  }
});

// @desc    Update an address (Admin only)
// @route   PATCH /api/addresses/:id
// @access  Private (Admin)
const updateAddress = asyncHandler(async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      throw new ForbiddenError('Access denied. Admin only.');
    }

    const address = await Address.findById(req.params.id);
    if (!address) {
      throw new NotFoundError('Address not found');
    }

    Object.assign(address, req.body);
    await address.save();

    res.json(address);
  } catch (error) {
    next(error);
  }
});

// @desc    Delete an address (Admin only)
// @route   DELETE /api/addresses/:id
// @access  Private (Admin)
const deleteAddress = asyncHandler(async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      throw new ForbiddenError('Access denied. Admin only.');
    }

    const address = await Address.findById(req.params.id);
    if (!address) {
      throw new NotFoundError('Address not found');
    }

    await address.deleteOne();
    res.json({ message: 'Address deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = {
  createAddress,
  getAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
  updateUserAddress,
};
