require('dotenv').config();
const mongoose = require('mongoose');
const UserModel = require('./src/models/UserModel');

// Function to test user creation
async function testUserModel() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to database successfully');

    // Create a test user
    const testUser = new UserModel({
      first_name: 'Test',
      last_name: 'User',
      email: 'test@example.com',
      password: 'Password123',
      phone_number: '0412345678',
      role: 'user'
    });

    // Save the user to the database
    await testUser.save();
    console.log('User created successfully:', {
      id: testUser._id,
      name: `${testUser.first_name} ${testUser.last_name}`,
      email: testUser.email
    });

    // Test password hashing (should be hashed now)
    const userWithPassword = await UserModel.findById(testUser._id).select('+password');
    console.log('Password is hashed:', userWithPassword.password !== 'Password123');

    // Test password comparison (should return true)
    const isPasswordCorrect = await testUser.comparePassword('Password123');
    console.log('Password comparison works:', isPasswordCorrect);

    // Test token generation
    const token = testUser.generateAuthToken();
    console.log('JWT Token generated:', token ? 'Success' : 'Failed');

    // Clean up - delete the test user
    await UserModel.deleteOne({ _id: testUser._id });
    console.log('Test user deleted');

    // All tests passed
    console.log('All tests passed! UserModel works correctly.');

  } catch (error) {
    console.error('Error testing UserModel:', error);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the test
testUserModel();