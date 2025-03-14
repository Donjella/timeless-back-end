const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
      trim: true,
    },
    last_name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
    phone_number: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      default: 'user',
    },
  },
  {
    timestamps: true,
  },
);

// Hash password before saving
userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method for matching entered password to hashed password
userSchema.methods.matchPassword = async function matchPassword(enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT Token method (named function)
userSchema.methods.generateToken = function generateToken() {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined.');
  }

  return jwt.sign(
    {
      id: this._id,
      first_name: this.first_name,
      last_name: this.last_name,
      email: this.email,
      role: this.role.toLowerCase(),
    },
    process.env.JWT_SECRET,
    { expiresIn: '1d' },
  );
};

module.exports = mongoose.model('User', userSchema);
