const request = require('supertest');
const mongoose = require('mongoose');
const app  = require('../server.js'); // Import Express app
const Watch = require('../models/watchModel.js') // Import watch Model


// Mock brand data
const testWatch =  {
    brand: {
      brand_name: testWatchBrand,
      required: true,
    },
    model: {
      model_name: testWatchModel,
      required: true,
      trim: true,
    },
    year: {
      value: 2025,
      required: true,
      min: 1000,
      max: new Date().getFullYear(),
      validate: {
        validator(v) {
          return /^\d{4}$/.test(v.toString());
        },
        message: 'Year must be a 4-digit number',
      },
    },
    rental_day_price: {
      type: Number,
      value: 10,
      required: true,
      min: 0,
    },
    condition: {
      type: String,
      value: 'New',
      required: true,
      enum: ['New', 'Excellent', 'Good', 'Fair', 'Poor'],
      default: 'Good',
    },
    quantity: {
      type: Number,
      value: 1,
      required: true,
      min: 0,
      default: 1,
    },
    // Additional fields that might be useful
    description: {
      type: String,
      value: 'descrip',
      trim: true,
    },
    image_url: {
      type: String,
      value: 'img',
      trim: true,
    },
  },

// Setup: Database Connection Before Running Tests
beforeAll(async () => {
    const mongoUri = 'mongodb://127.0.0.1:27017/timeless-test';
    await mongoose.connect(mongoUri);
  });
  
  // Cleanup: Clear Database After Each Test
  afterEach(async () => {
    console.log('Clearing test watches from database...');
    await Watch.deleteMany(); // Ensures each test starts fresh
  });
  
  // Close Database Connection After All Tests
  afterAll(async () => {
    await mongoose.connection.close();
    console.log('Disconnected from test database');
  });