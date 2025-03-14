const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const User = require('../models/userModel');
const Address = require('../models/addressModel');

// @desc    Register a new user with required address
// @route   POST /api/users/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    first_name,
    last_name,
    email,
    password,
    phone_number,
    street_address,
    suburb,
    state,
    postcode,
  } = req.body;

  if (!first_name || !last_name || !email || !password
      || !street_address || !suburb || !state || !postcode) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(409).json({ message: 'User already exists' });
  }

  const address = await Address.create({
    street_address,
    suburb,
    state,
    postcode,
  });

  const user = await User.create({
    first_name,
    last_name,
    email,
    password,
    phone_number,
    address: address._id,
  });

  res.status(201).json({
    _id: user._id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    phone_number: user.phone_number,
    role: user.role,
    address,
    token: user.generateToken(),
  });
});

// @desc    Authenticate user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password').populate('address');

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  res.json({
    _id: user._id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    phone_number: user.phone_number,
    role: user.role,
    address: user.address,
    token: user.generateToken(),
  });
});

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Access denied. Admin only.');
  }

  const users = await User.find().populate('address').select('-password');
  res.json(users);
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('address');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.json(user);
});

// @desc    Update user profile (PATCH)
// @route   PATCH /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  Object.assign(user, req.body);

  if (req.body.password) {
    user.password = await bcrypt.hash(req.body.password, 10);
  }

  if (req.body.street_address || req.body.suburb || req.body.state || req.body.postcode) {
    let address = await Address.findById(user.address);

    if (address) {
      Object.assign(address, {
        street_address: req.body.street_address,
        suburb: req.body.suburb,
        state: req.body.state,
        postcode: req.body.postcode,
      });
      await address.save();
    } else {
      address = await Address.create({
        street_address: req.body.street_address,
        suburb: req.body.suburb,
        state: req.body.state,
        postcode: req.body.postcode,
      });
      user.address = address._id;
    }
  }

  await user.save();
  const updatedUser = await User.findById(user._id).populate('address');
  res.json(updatedUser);
});

// @desc    Update user role (Admin only)
// @route   PATCH /api/users/role/:id
// @access  Private/Admin
const updateUserRole = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Access denied. Admin only.');
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    { role: req.body.role },
    { new: true },
  );

  if (!updatedUser) {
    res.status(404);
    throw new Error('User not found');
  }

  res.json({ message: `User role updated to ${updatedUser.role}` });
});

module.exports = {
  registerUser,
  loginUser,
  getUsers,
  getUserProfile,
  updateUserProfile,
  updateUserRole,
};
