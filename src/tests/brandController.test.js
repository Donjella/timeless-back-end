const request = require('supertest');
const mongoose = require('mongoose');
const app  = require('../server.js'); // Import Express app
const Brand = require('../models/brandModel.js') // Import brand model

const testUser = require('./userController.test.js');
const { getBrandById } = require('../controllers/brandController.js');

// Mock brand data
const testBrand = {
    brand_name: 'BeckhamBrand',
  };

// Setup: Database Connection Before Running Tests
beforeAll(async () => {
    const mongoUri = 'mongodb://127.0.0.1:27017/timeless-test';
    await mongoose.connect(mongoUri);
  });
  
  // Cleanup: Clear Database After Each Test
  afterEach(async () => {
    console.log('Clearing test brands from database...');
    await Brand.deleteMany(); // Ensures each test starts fresh
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
    it('Should return validation error for missing required fields ', async () => {
      let res = await request(app).post('/api/brands/').send({ brand_name: '' });
  
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toMatch(/Missing required fields/);
    });
  
    it('Should pass with valid brand name ', async () => {
        let res = await request(app).post('/api/brands/').send({ brand_name: 'TestBrand' });
    
        expect(res.statusCode).toBe(200);
      });

  });


/**
 * Authentication & Authorization Tests
 */
describe('Authentication & Authorization', () => {
    let userToken, adminToken, userId;
  
    beforeEach(async () => {
      // Register a regular user - might be uneccesary here as not testing register function, might be needed to set regular vs admin users to test user role checks
      const userRes = await request(app).post('/api/users/register').send(testUser);
      userToken = userRes.body.token;
      userId = userRes.body._id;
      
      // Register an admin user - same as above
      const adminRes = await request(app).post('/api/users/register').send({
        ...testUser,
        email: 'admin@example.com',
        role: 'admin',
      });
      adminToken = adminRes.body.token;
    });
    
    it('Should return watch brand when authenticated', async () => {
        const res = await request(app)
          .get('/api/brands/')
          .set('Authorization', `Bearer ${userToken}`);
    
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
        expect(res.body.brand_name).toBe(testBrand.brand_name)
      });
    
      it('Should not allow access to watch brands without a token', async () => {
        const res = await request(app).get('/api/brands/');
    
        expect(res.statusCode).toBe(401);
        expect(res.body.message).toMatch(/Not authorized/);
    });
});

/**
 * Database Interaction (Service Layer Logic) Tests
 */
jest.mock('../models/brandModel.js');

describe('Retrieve a correct brand from API when sent a valid brand_name ', () => {
    let req, res;

    beforeEach(() => {
        req = { params: { brand_name: "BeckhamBrand" } };
        res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    });

    test("returns user for valid ID", async () => {
        const mockBrand = { _id: "123", brand_name: "ABrand" };
        Brand.findById.mockResolvedValue(mockBrand);

        await getBrandById(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockBrand);
    });

    test("returns 404 for non-existent brand", async () => {
        Brand.findById.mockResolvedValue(null);

        await getBrandById(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "Brand not found" });
    });

    test("returns 500 for database error", async () => {
        Brand.findById.mockRejectedValue(new Error());

        await getBrandById(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
    });
});

  /**
 * Role-Based Access Control Tests
 */
describe('Role-Based Access Control', () => {
    let adminToken, userToken, userId;
  
    beforeEach(async () => {
      // Register a normal user through API
      const userRes = await request(app).post('/api/users/register').send(testUser);
      userToken = userRes.body.token;
      userId = userRes.body._id;
      
      // Create admin user directly in database
      const adminUser = new User({
        ...testUser,
        email: 'admin@example.com',
        role: 'admin',
        password: 'CorrectPW'  // Need to set password directly since we're bypassing registration
      });
      await adminUser.save();
      
      // Get admin token by generating it directly
      adminToken = adminUser.generateToken();
    });
  
    it('Should check existing user is admin before allowing create operation', async () => {
        const existingUser = { ...testUser, role: 'admin' };
        const res = await request(app).post('/api/brands/').send(existingUser);
    
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('role');
        expect(res.user.role).toBe('admin');
      });
    
    it('Should not allow non admin to create brand', async () =>{
        const existingUser = { ...testUser, role: !'admin' };
        const res = await request(app).post('/api/brands/').send(existingUser);

        expect(res.statusCode).toBe(401);
        expect(res.body.message).toMatch(/Not authorized/);
    }); 

    it('Should check existing user is admin before allowing delete operation', async () => {
        const existingUser = { ...testUser, role: 'admin' };
        const res = await request(app).delete('/api/brands/:id').send(existingUser);
    
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('role');
        expect(res.user.role).toBe('admin');
      });
    
    it('Should not allow non admin to delete brand', async () =>{
        const existingUser = { ...testUser, role: !'admin' };
        const res = await request(app).delete('/api/brands/:id').send(existingUser);

        expect(res.statusCode).toBe(401);
        expect(res.body.message).toMatch(/Not authorized/);
    }); 
  });