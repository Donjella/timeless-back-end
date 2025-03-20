const request = require('supertest');
const mongoose = require('mongoose');
const { app } = require('../server');
const User = require('../models/userModel');
const WatchModel = require('../models/watchModel');
const Brand = require('../models/brandModel');

// Function to generate unique test users
const generateTestUser = (suffix) => ({
  first_name: 'John',
  last_name: 'Doe',
  email: `johndoe${suffix}@example.com`,
  password: 'Password123',
  phone_number: '1234567890',
  street_address: '123 Main St',
  suburb: 'Richmond',
  state: 'VIC',
  postcode: '3121',
});

// Setup: Database Connection Before Running Tests
beforeAll(async () => {
  const mongoUri = 'mongodb://127.0.0.1:27017/timeless-test';
  await mongoose.connect(mongoUri);
});

// Cleanup: Clear Database After Each Test
afterEach(async () => {
  console.log('Clearing test users, brands and watches from database...');
  await User.deleteMany();
  await WatchModel.deleteMany();
  await Brand.deleteMany();
});

// Close Database Connection After All Tests
afterAll(async () => {
  await mongoose.connection.close();
  console.log('Disconnected from test database');
});

/**
 * Input Validation & Error Handling Tests
 */
describe('Input Validation & Error Handling', () => {
  let brandId;
  let adminToken;

  beforeEach(async () => {
    // Create admin user
    const adminUser = new User({
      ...generateTestUser('watch-admin'),
      role: 'admin',
    });
    await adminUser.save();
    adminToken = adminUser.generateToken();

    // Create a test brand
    const brand = new Brand({ brand_name: 'Rolex' });
    await brand.save();
    brandId = brand._id;
  });

  it('Should return validation error for missing required fields', async () => {
    const res = await request(app)
      .post('/api/watches')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ model: 'Submariner' }); // Missing other required fields

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/Missing required fields/);
  });

  it('Should return validation error for invalid condition', async () => {
    const res = await request(app)
      .post('/api/watches')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        model: 'Submariner',
        year: 2020,
        rentalDayPrice: 100,
        condition: 'Invalid', // Invalid condition
        quantity: 5,
        brandId: brandId,
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/Invalid condition/);
  });

  it('Should successfully create watch with valid data', async () => {
    const watchData = {
      model: 'Submariner',
      year: 2020,
      rentalDayPrice: 100,
      condition: 'Excellent',
      quantity: 5,
      brandId: brandId,
    };

    const res = await request(app)
      .post('/api/watches')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(watchData);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('model', watchData.model);
    expect(res.body).toHaveProperty('condition', 'Excellent'); // Check title case conversion
  });
});

/**
 * Authentication & Authorization Tests
 */
describe('Authentication & Authorization', () => {
  let userToken;
  let adminToken;
  let watchId;
  let brandId;

  beforeEach(async () => {
    // Create a regular user
    const user = new User(generateTestUser('watch-auth-user'));
    await user.save();
    userToken = user.generateToken();

    // Create an admin user
    const adminUser = new User({
      ...generateTestUser('watch-auth-admin'),
      role: 'admin',
    });
    await adminUser.save();
    adminToken = adminUser.generateToken();

    // Create a test brand
    const brand = new Brand({ brand_name: 'Omega' });
    await brand.save();
    brandId = brand._id;

    // Create a test watch
    const watch = new WatchModel({
      model: 'Speedmaster',
      year: 2019,
      rentalDayPrice: 80,
      condition: 'Good',
      quantity: 3,
      brand: brandId,
    });
    await watch.save();
    watchId = watch._id;
  });

  it('Should verify admin token is available', async () => {
    // This test explicitly uses the adminToken to satisfy ESLint
    const adminWatchData = {
      model: 'Seamaster',
      year: 2022,
      rentalDayPrice: 120,
      condition: 'Excellent',
      quantity: 2,
      brandId: brandId,
    };

    const res = await request(app)
      .post('/api/watches')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(adminWatchData);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('model', 'Seamaster');
  });

  it('Should allow public access to watches list', async () => {
    const res = await request(app).get('/api/watches');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('Should allow public access to watch details', async () => {
    const res = await request(app).get(`/api/watches/${watchId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('model', 'Speedmaster');
  });

  it('Should prevent non-admin users from creating watches', async () => {
    const watchData = {
      model: 'Datejust',
      year: 2021,
      rentalDayPrice: 90,
      condition: 'New',
      quantity: 2,
      brandId: brandId,
    };

    const res = await request(app)
      .post('/api/watches')
      .set('Authorization', `Bearer ${userToken}`)
      .send(watchData);

    expect(res.statusCode).toBe(403);
    expect(res.body.message).toMatch(/Not authorized as admin/);
  });

  it('Should prevent non-admin users from updating watches', async () => {
    const updateData = {
      rentalDayPrice: 95,
    };

    const res = await request(app)
      .put(`/api/watches/${watchId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send(updateData);

    expect(res.statusCode).toBe(403);
    expect(res.body.message).toMatch(/Not authorized as admin/);
  });

  it('Should prevent non-admin users from deleting watches', async () => {
    const res = await request(app)
      .delete(`/api/watches/${watchId}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(403);
    expect(res.body.message).toMatch(/Not authorized as admin/);
  });
});

/**
 * Database Interaction Tests
 */
describe('Database Interaction', () => {
  let brandId;
  
  beforeEach(async () => {
    // Create a test brand before each test
    const brand = new Brand({ brand_name: 'Tag Heuer' });
    await brand.save();
    brandId = brand._id;
  });

  it('Should create a new watch in the database', async () => {
    // Create admin user
    const adminUser = new User({
      ...generateTestUser('watch-db-admin'),
      role: 'admin',
    });
    await adminUser.save();
    const adminToken = adminUser.generateToken();

    const watchData = {
      model: 'Carrera',
      year: 2018,
      rentalDayPrice: 70,
      condition: 'Excellent',
      quantity: 4,
      brandId: brandId,
    };

    const res = await request(app)
      .post('/api/watches')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(watchData);

    // Verify the watch was created
    expect(res.statusCode).toBe(201);

    // Check if it exists in the database
    const watch = await WatchModel.findById(res.body._id);
    expect(watch).toBeTruthy();
    expect(watch.model).toBe(watchData.model);
    expect(watch.brand.toString()).toBe(brandId.toString());
  });

  it('Should return 404 for non-existent watch ID', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/watches/${nonExistentId}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch(/Watch not found/);
  });

  it('Should populate brand information when getting watches', async () => {
    // Create a watch
    const watch = new WatchModel({
      model: 'Monaco',
      year: 2017,
      rentalDayPrice: 60,
      condition: 'Good',
      quantity: 2,
      brand: brandId,
    });
    await watch.save();

    // Fetch the watch and check if brand info is populated
    const res = await request(app).get(`/api/watches/${watch._id}`);
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('brand');
    
    // Check for populated brand details
    expect(res.body.brand).toHaveProperty('_id', brandId.toString());
    expect(res.body.brand).toHaveProperty('brand_name', 'Tag Heuer');
  });

  it('Should create a watch with an image URL', async () => {
    // Create admin user
    const adminUser = new User({
      ...generateTestUser('watch-image-admin'),
      role: 'admin',
    });
    await adminUser.save();
    const adminToken = adminUser.generateToken();
  
    // Create a test brand
    const brand = new Brand({ brand_name: 'Test Brand' });
    await brand.save();
  
    const watchData = {
      model: 'Test Watch',
      year: 2023,
      rentalDayPrice: 100,
      condition: 'Excellent',
      quantity: 5,
      brandId: brand._id,
      imageUrl: 'https://example.com/watch-image.jpg'
    };
  
    const res = await request(app)
      .post('/api/watches')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(watchData);
  
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('imageUrl', watchData.imageUrl);
  
    // Verify in database
    const watch = await WatchModel.findById(res.body._id);
    expect(watch.imageUrl).toBe(watchData.imageUrl);
  });
  
  it('Should update watch with image URL', async () => {
    // Create admin user
    const adminUser = new User({
      ...generateTestUser('watch-image-update-admin'),
      role: 'admin',
    });
    await adminUser.save();
    const adminToken = adminUser.generateToken();
  
    // Create a test brand
    const brand = new Brand({ brand_name: 'Test Brand' });
    await brand.save();
  
    // Create a watch
    const watch = new WatchModel({
      model: 'Original Watch',
      year: 2022,
      rentalDayPrice: 90,
      condition: 'Good',
      quantity: 3,
      brand: brand._id,
    });
    await watch.save();
  
    const updateData = {
      imageUrl: 'https://example.com/updated-watch-image.jpg'
    };
  
    const res = await request(app)
      .put(`/api/watches/${watch._id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(updateData);
  
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('imageUrl', updateData.imageUrl);
  
    // Verify in database
    const updatedWatch = await WatchModel.findById(watch._id);
    expect(updatedWatch.imageUrl).toBe(updateData.imageUrl);
  });
  
  it('Should allow creating a watch without an image URL', async () => {
    // Create admin user
    const adminUser = new User({
      ...generateTestUser('watch-no-image-admin'),
      role: 'admin',
    });
    await adminUser.save();
    const adminToken = adminUser.generateToken();
  
    // Create a test brand
    const brand = new Brand({ brand_name: 'Test Brand' });
    await brand.save();
  
    const watchData = {
      model: 'Imageless Watch',
      year: 2023,
      rentalDayPrice: 100,
      condition: 'Excellent',
      quantity: 5,
      brandId: brand._id,
    };
  
    const res = await request(app)
      .post('/api/watches')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(watchData);
  
    expect(res.statusCode).toBe(201);
    expect(res.body.imageUrl).toBe('');
  
    // Verify in database
    const watch = await WatchModel.findById(res.body._id);
    expect(watch.imageUrl).toBe('');
  });
});

/**
 * Admin Operations Tests
 */
describe('Admin Operations', () => {
  let adminToken;
  let brandId;
  let watchId;

  beforeEach(async () => {
    // Create admin user
    const adminUser = new User({
      ...generateTestUser('watch-admin-ops'),
      role: 'admin',
    });
    await adminUser.save();
    adminToken = adminUser.generateToken();

    // Create a test brand
    const brand = new Brand({ brand_name: 'Patek Philippe' });
    await brand.save();
    brandId = brand._id;

    // Create a test watch
    const watch = new WatchModel({
      model: 'Nautilus',
      year: 2022,
      rentalDayPrice: 200,
      condition: 'New',
      quantity: 1,
      brand: brandId,
    });
    await watch.save();
    watchId = watch._id;
  });

  it('Should allow admin to update a watch', async () => {
    const updateData = {
      rentalDayPrice: 250,
      condition: 'excellent', // Test lowercase conversion
      quantity: 2,
    };

    const res = await request(app)
      .put(`/api/watches/${watchId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(updateData);

    expect(res.statusCode).toBe(200);
    expect(res.body.rentalDayPrice).toBe(updateData.rentalDayPrice);
    expect(res.body.condition).toBe('Excellent'); // Should be converted to title case
    expect(res.body.quantity).toBe(updateData.quantity);
  });

  it('Should allow admin to delete a watch', async () => {
    const res = await request(app)
      .delete(`/api/watches/${watchId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/Watch removed/);

    // Verify watch was deleted
    const watch = await WatchModel.findById(watchId);
    expect(watch).toBeNull();
  });

  it('Should handle updating a non-existent watch', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const updateData = {
      rentalDayPrice: 300,
    };

    const res = await request(app)
      .put(`/api/watches/${nonExistentId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(updateData);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch(/Watch not found/);
  });

  it('Should validate year within range during update', async () => {
    const currentYear = new Date().getFullYear();
    const updateData = {
      year: currentYear + 5, // Future year (invalid)
    };

    const watch = await WatchModel.findById(watchId);
    const originalYear = watch.year;

    await request(app)
      .put(`/api/watches/${watchId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(updateData);

    // fetch the watch again to verify year wasn't updated to an invalid value
    const updatedWatch = await WatchModel.findById(watchId);
    expect(updatedWatch.year).toBe(originalYear);
  });

  it('Should handle partial updates correctly', async () => {
    // Only update model name
    const updateData = {
      model: 'Nautilus Rose Gold',
    };

    const res = await request(app)
      .put(`/api/watches/${watchId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(updateData);

    expect(res.statusCode).toBe(200);
    expect(res.body.model).toBe(updateData.model);

    // Confirm other fields haven't changed
    const watch = await WatchModel.findById(watchId);
    expect(watch.year).toBe(2022);
    expect(watch.condition).toBe('New');
  });
});