const User = require("../models/userModel");
const Address = require("../models/addressModel");
const { validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

// @desc    Register a new user with required address
// @route   POST /api/users/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { first_name, last_name, email, password, phone_number, street_address, suburb, state, postcode } = req.body;

  // Check for missing required fields
  const missingFields = [];
  if (!first_name) missingFields.push("first name");
  if (!last_name) missingFields.push("last name");
  if (!email) missingFields.push("email");
  if (!password) missingFields.push("password");
  if (!street_address) missingFields.push("street address");
  if (!suburb) missingFields.push("suburb");
  if (!state) missingFields.push("state");
  if (!postcode) missingFields.push("postcode");

  if (missingFields.length > 0) {
    return res.status(400).json({ message: `All fields are required. Please enter: ${missingFields.join(", ")}` });
  }

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(409).json({ message: "User already exists" });
  }

  try {
    // Create the address first
    const address = await Address.create({ street_address, suburb, state, postcode });

    // Create user with reference to the address
    const user = await User.create({ first_name, last_name, email, password, phone_number, address: address._id });

    return res.status(201).json({
      _id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone_number: user.phone_number,
      role: user.role,
      address: {
        _id: address._id,
        street_address,
        suburb,
        state,
        postcode,
      },
      token: user.generateAuthToken(),
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ message: "Registration failed", error: error.message });
  }
});

// @desc    Authenticate user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user and populate address
  const user = await User.findOne({ email }).select("+password").populate("address");

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  // Check password match
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  // Successful login
  return res.json({
    _id: user._id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    phone_number: user.phone_number,
    role: user.role,
    address: user.address,
    token: user.generateAuthToken(),
  });
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  // Find user and populate address
  const user = await User.findById(req.user._id).populate("address");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.json({
    _id: user._id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    phone_number: user.phone_number,
    role: user.role,
    address: user.address,
  });
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Update user fields
  user.first_name = req.body.first_name || user.first_name;
  user.last_name = req.body.last_name || user.last_name;
  user.email = req.body.email || user.email;
  user.phone_number = req.body.phone_number || user.phone_number;

  if (req.body.password) {
    user.password = req.body.password; // Password will be hashed in pre-save hook
  }

  try {
    //  Handle address update
    if (req.body.street_address || req.body.suburb || req.body.state || req.body.postcode) {
      let address = await Address.findById(user.address);

      if (address) {
        // Update existing address
        address.street_address = req.body.street_address || address.street_address;
        address.suburb = req.body.suburb || address.suburb;
        address.state = req.body.state || address.state;
        address.postcode = req.body.postcode || address.postcode;
        await address.save();
      } else {
        // If no existing address, create a new one
        address = await Address.create({
          street_address: req.body.street_address,
          suburb: req.body.suburb,
          state: req.body.state,
          postcode: req.body.postcode,
        });
        user.address = address._id;
      }
    }

    const updatedUser = await user.save();
    const populatedUser = await User.findById(updatedUser._id).populate("address");

    return res.json({
      _id: populatedUser._id,
      first_name: populatedUser.first_name,
      last_name: populatedUser.last_name,
      email: populatedUser.email,
      phone_number: populatedUser.phone_number,
      role: populatedUser.role,
      address: populatedUser.address,
      token: populatedUser.generateAuthToken(),
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return res.status(500).json({ message: "Profile update failed", error: error.message });
  }
});

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
};
