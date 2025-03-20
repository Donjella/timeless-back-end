const mongoose = require('mongoose');

const watchSchema = mongoose.Schema(
  {
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Brand',
      required: true,
    },
    model: {
      type: String,
      required: true,
      trim: true,
    },
    year: {
      type: Number,
      required: true,
      validate: {
        validator: function validateYear(v) {
          return v >= 1900 && v <= new Date().getFullYear();
        },
        message: (props) => `${props.value} is not a valid year!`,
      },
    },
    rentalDayPrice: {
      type: Number,
      required: true,
      min: [0, 'Rental price cannot be negative'],
    },
    condition: {
      type: String,
      required: true,
      enum: {
        values: ['New', 'Excellent', 'Good', 'Fair', 'Poor'],
        message: '{VALUE} is not a valid condition',
      },
      set: (value) => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase(),
    },
    quantity: {
      type: Number,
      required: true,
      min: [0, 'Quantity cannot be negative'],
      default: 1,
    },
    imageUrl: {
      type: String,
      default: '',
      trim: true,
      validate: {
        validator: function validateImageUrl(v) {
          // Optional URL validation (basic regex)
          return v === '' || /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(v);
        },
        message: (props) => `${props.value} is not a valid URL!`,
      },
    },
  },
  {
    timestamps: true,
  },
);

// Add a pre-save hook to ensure condition is properly formatted
watchSchema.pre('save', function preSaveHook(next) {
  if (this.condition) {
    this.condition = this.condition.charAt(0).toUpperCase() + this.condition.slice(1).toLowerCase();
  }
  next();
});

const WatchModel = mongoose.model('Watch', watchSchema);

module.exports = WatchModel;
