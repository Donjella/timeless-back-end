const asyncHandler = require('express-async-handler');
const WatchModel = require('../models/watchModel');
const Brand = require('../models/brandModel');
const {
  NotFoundError,
  ValidationError,
  ForbiddenError,
} = require('../utils/errors');

// @desc    Create a new watch
// @route   POST /api/watches
// @access  Private/Admin
const createWatch = asyncHandler(async (req, res) => {
  const {
    model,
    year,
    rental_day_price,
    condition,
    quantity,
    brandId,
    image_url,
  } = req.body;

  // Validate required fields
  const requiredFields = ['model', 'year', 'rental_day_price', 'condition', 'brandId'];
  const missingFields = requiredFields.filter((field) => !req.body[field]);

  if (missingFields.length > 0) {
    throw new ValidationError(`Missing required fields: ${missingFields.join(', ')}`);
  }

  // Validate condition
  const validConditions = ['New', 'Excellent', 'Good', 'Fair', 'Poor'];
  const formattedCondition = condition.charAt(0).toUpperCase() + condition.slice(1).toLowerCase();

  if (!validConditions.includes(formattedCondition)) {
    throw new ValidationError('Invalid condition');
  }

  // Check if brand exists
  const brand = await Brand.findById(brandId);
  if (!brand) {
    throw new NotFoundError('Brand not found');
  }

  // Create watch
  const watch = new WatchModel({
    model,
    year,
    rental_day_price,
    condition: formattedCondition,
    quantity: quantity || 1,
    brand: brandId,
    image_url: image_url || '', // Optional image URL
  });

  const createdWatch = await watch.save();

  // Populate brand info for response
  await createdWatch.populate('brand', 'brand_name');

  res.status(201).json(createdWatch);
});

// @desc    Get all watches
// @route   GET /api/watches
// @access  Public
const getWatches = asyncHandler(async (req, res) => {
  const watches = await WatchModel.find().populate('brand', 'brand_name');
  res.json(watches);
});

// @desc    Get a single watch by ID
// @route   GET /api/watches/:id
// @access  Public
const getWatchById = asyncHandler(async (req, res) => {
  const watch = await WatchModel.findById(req.params.id).populate('brand', 'brand_name');

  if (!watch) {
    throw new NotFoundError('Watch not found');
  }

  res.json(watch);
});

// @desc    Update a watch
// @route   PUT /api/watches/:id
// @access  Private/Admin
const updateWatch = asyncHandler(async (req, res) => {
  // Ensure user is an admin
  if (req.user.role !== 'admin') {
    throw new ForbiddenError('Access denied. Admin only.');
  }

  const {
    model,
    year,
    rental_day_price,
    condition,
    quantity,
    brandId,
    image_url,
  } = req.body;

  // Find the watch
  const watch = await WatchModel.findById(req.params.id);

  if (!watch) {
    throw new NotFoundError('Watch not found');
  }

  // Update fields if provided
  if (model) watch.model = model;
  if (year) watch.year = year;
  if (rental_day_price !== undefined) watch.rental_day_price = rental_day_price;

  // Validate and update condition
  if (condition) {
    const validConditions = ['New', 'Excellent', 'Good', 'Fair', 'Poor'];
    const formattedCondition = condition.charAt(0).toUpperCase() + condition.slice(1).toLowerCase();

    if (validConditions.includes(formattedCondition)) {
      watch.condition = formattedCondition;
    } else {
      throw new ValidationError('Invalid condition');
    }
  }

  // Update quantity
  if (quantity !== undefined) watch.quantity = quantity;

  // Update brand if provided and exists
  if (brandId) {
    const brand = await Brand.findById(brandId);
    if (!brand) {
      throw new NotFoundError('Brand not found');
    }
    watch.brand = brandId;
  }

  // Update image URL
  if (image_url !== undefined) {
    watch.image_url = image_url;
  }

  const updatedWatch = await watch.save();
  await updatedWatch.populate('brand', 'brand_name');

  res.json(updatedWatch);
});

// @desc    Delete a watch
// @route   DELETE /api/watches/:id
// @access  Private/Admin
const deleteWatch = asyncHandler(async (req, res) => {
  // Ensure user is an admin
  if (req.user.role !== 'admin') {
    throw new ForbiddenError('Access denied. Admin only.');
  }

  const watch = await WatchModel.findById(req.params.id);

  if (!watch) {
    throw new NotFoundError('Watch not found');
  }

  await watch.deleteOne();
  res.json({ message: 'Watch removed' });
});

module.exports = {
  createWatch,
  getWatches,
  getWatchById,
  updateWatch,
  deleteWatch,
};
