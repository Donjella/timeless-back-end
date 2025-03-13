const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Define the user schema
const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
      trim: true
    },
    last_name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false 
    },
    phone_number: {
      type: String,
      trim: true
    },
    role: {
      type: String,
      enum: ['customer', 'admin'],
      default: 'customer'
    },
    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address'
      }
  },
  {
    timestamps: true
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  // Generate salt and hash password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password for login
userSchema.methods.comparePassword = async function (passwordToCheck) {
    return bcrypt.compare(passwordToCheck, this.password);
  };
  

// Generate JWT token
userSchema.methods.generateAuthToken = function () {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables.");
  }

  return jwt.sign(
    {
      id: this._id,
      first_name: this.first_name,
      last_name: this.last_name,
      email: this.email,
      role: this.role.toLowerCase() // Standardize role for security
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

// Create and export the User model
const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
