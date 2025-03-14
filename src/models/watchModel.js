const mongoose = require("mongoose");

// Define the watch schema
const watchSchema = new mongoose.Schema(
  {
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Brand',
      required: true
    },
    model: {
      type: String,
      required: true,
      trim: true
    },
    year: {
        type: Number,
        required: true,
        min: 1000, 
        max: new Date().getFullYear(), 
        validate: {
          validator: function(v) {
            return /^\d{4}$/.test(v.toString()); 
          },
          message: "Year must be a 4-digit number"
        }
    },
    rental_day_price: {
      type: Number,
      required: true,
      min: 0
    },
    condition: {
      type: String,
      required: true,
      enum: ['New', 'Excellent', 'Good', 'Fair', 'Poor'],
      default: 'Good'
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
      default: 1
    },
    // Additional fields that might be useful
    description: {
      type: String,
      trim: true
    },
    image_url: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

// Create and export the Watch model
const WatchModel = mongoose.model("Watch", watchSchema);

module.exports = WatchModel;
