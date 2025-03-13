const Watch = require('../models/watchModel');
const asyncHandler = require('express-async-handler');

// Function to convert string to title case
const titleCase = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

// Valid condition options
const validConditions = ['New', 'Excellent', 'Good', 'Fair', 'Poor'];

// @desc    Create a new watch (Admin only)
// @route   POST /api/watches
// @access  Private (Admin)
const createWatch = asyncHandler(async (req, res) => {
  try {
    const { model, year, rental_day_price, condition, quantity, brand_id } = req.body;

    if (!model || !year || !rental_day_price || !condition || !quantity || !brand_id) {
      res.status(400);
      throw new Error('All fields are required');
    }

    // Convert condition to title case
    const formattedCondition = titleCase(condition);

    // Validate condition
    if (!validConditions.includes(formattedCondition)) {
      res.status(400);
      throw new Error(`Invalid condition: '${condition}'. Valid options are: ${validConditions.join(', ')}`);
    }

    const watch = await Watch.create({ 
      model, 
      year, 
      rental_day_price, 
      condition: formattedCondition, 
      quantity, 
      brand: brand_id 
    });

    if (watch) {
      res.status(201).json(watch);
    } else {
      res.status(400);
      throw new Error('Invalid watch data');
    }
  } catch (error) {
    throw error;
  }
});

// @desc    Get all watches
// @route   GET /api/watches
// @access  Public
const getWatches = asyncHandler(async (req, res) => {
  const watches = await Watch.find().populate('brand', 'brand_name');
  res.json(watches);
});

// @desc    Get a single watch by ID
// @route   GET /api/watches/:id
// @access  Public
const getWatchById = asyncHandler(async (req, res) => {
  const watch = await Watch.findById(req.params.id).populate('brand', 'brand_name');

  if (watch) {
    res.json(watch);
  } else {
    res.status(404);
    throw new Error('Watch not found');
  }
});

// @desc    Update a watch (Admin only)
// @route   PUT /api/watches/:id
// @access  Private (Admin)
const updateWatch = asyncHandler(async (req, res) => {
  const watch = await Watch.findById(req.params.id);

  if (watch) {
    watch.model = req.body.model || watch.model;
    watch.year = req.body.year || watch.year;
    watch.rental_day_price = req.body.rental_day_price || watch.rental_day_price;

    if (req.body.condition) {
      const formattedCondition = titleCase(req.body.condition);

      if (!validConditions.includes(formattedCondition)) {
        res.status(400);
        throw new Error(`Invalid condition: '${req.body.condition}'. Valid options are: ${validConditions.join(', ')}`);
      }

      watch.condition = formattedCondition;
    }

    watch.quantity = req.body.quantity || watch.quantity;

    const updatedWatch = await watch.save();
    res.json(updatedWatch);
  } else {
    res.status(404);
    throw new Error('Watch not found');
  }
});

// @desc    Delete a watch (Admin only)
// @route   DELETE /api/watches/:id
// @access  Private (Admin)
const deleteWatch = asyncHandler(async (req, res) => {
  const watch = await Watch.findById(req.params.id);

  if (watch) {
    await watch.deleteOne();
    res.json({ message: 'Watch removed' });
  } else {
    res.status(404);
    throw new Error('Watch not found');
  }
});

module.exports = {
  createWatch,
  getWatches,
  getWatchById,
  updateWatch,
  deleteWatch
};
