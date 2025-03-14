const asyncHandler = require('express-async-handler');
const Brand = require('../models/brandModel');

// @desc    Create a new brand (Admin only)
// @route   POST /api/brands
// @access  Private (Admin)
const createBrand = asyncHandler(async (req, res) => {
  const { brand_name } = req.body;

  if (!brand_name) {
    res.status(400);
    throw new Error('Brand name is required');
  }

  // Check if brand already exists
  const brandExists = await Brand.findOne({ brand_name: { $regex: new RegExp(`^${brand_name}$`, 'i') } });
  if (brandExists) {
    res.status(400);
    throw new Error('Brand already exists');
  }

  const brand = await Brand.create({ brand_name });

  if (brand) {
    res.status(201).json(brand);
  } else {
    res.status(400);
    throw new Error('Invalid brand data');
  }
});

// @desc    Get all brands
// @route   GET /api/brands
// @access  Public
const getBrands = asyncHandler(async (req, res) => {
  const brands = await Brand.find({}).sort({ brand_name: 1 });
  res.json(brands);
});

// @desc    Get a single brand by ID
// @route   GET /api/brands/:id
// @access  Public
const getBrandById = asyncHandler(async (req, res) => {
  const brand = await Brand.findById(req.params.id);

  if (brand) {
    res.json(brand);
  } else {
    res.status(404);
    throw new Error('Brand not found');
  }
});

// @desc    Update a brand (Admin only)
// @route   PUT /api/brands/:id
// @access  Private (Admin)
const updateBrand = asyncHandler(async (req, res) => {
  const { brand_name } = req.body;

  if (!brand_name) {
    res.status(400);
    throw new Error('Brand name is required');
  }

  const brand = await Brand.findById(req.params.id);

  if (brand) {
    // Check if updated name already exists (excluding current brand)
    const nameExists = await Brand.findOne({
      brand_name: { $regex: new RegExp(`^${brand_name}$`, 'i') },
      _id: { $ne: req.params.id },
    });

    if (nameExists) {
      res.status(400);
      throw new Error('Brand name already exists');
    }

    brand.brand_name = brand_name;

    const updatedBrand = await brand.save();
    res.json(updatedBrand);
  } else {
    res.status(404);
    throw new Error('Brand not found');
  }
});

// @desc    Delete a brand (Admin only)
// @route   DELETE /api/brands/:id
// @access  Private (Admin)
const deleteBrand = asyncHandler(async (req, res) => {
  const brand = await Brand.findById(req.params.id);

  if (brand) {
    await brand.deleteOne();
    res.json({ message: 'Brand removed' });
  } else {
    res.status(404);
    throw new Error('Brand not found');
  }
});

module.exports = {
  createBrand,
  getBrands,
  getBrandById,
  updateBrand,
  deleteBrand,
};
