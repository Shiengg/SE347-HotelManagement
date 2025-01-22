require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Role = require('../models/Role');
const connectDB = require('../utils/dbConnect');

const createTestData = async () => {
  try {
    await connectDB();

    // Kiểm tra và tạo roles nếu chưa tồn tại
    const roleNames = ['admin', 'receptionist', 'customer'];
    const roles = [];

    for (const roleName of roleNames) {
      let role = await Role.findOne({ role_name: roleName });
      if (!role) {
        role = await Role.create({ role_name: roleName });
        console.log(`Created new role: ${roleName}`);
      } else {
        console.log(`Using existing role: ${roleName}`);
      }
      roles.push(role);
    }

    // Kiểm tra và tạo users nếu chưa tồn tại
    const testUsers = [
      {
        username: 'admin',
        password: 'admin123',
        email: 'admin@example.com',
        fullname: 'Admin User',
        phonenumber: '0123456789',
        role_id: roles[0]._id // admin role
      },
      {
        username: 'receptionist',
        password: 'receptionist123',
        email: 'receptionist@example.com',
        fullname: 'Receptionist User',
        phonenumber: '0123456788',
        role_id: roles[1]._id // receptionist role
      },
      {
        username: 'customer',
        password: 'customer123',
        email: 'customer@example.com',
        fullname: 'Customer User',
        phonenumber: '0123456787',
        role_id: roles[2]._id // customer role
      },
      {
        username: 'customer2',
        password: 'customer123',
        email: 'customer2@example.com',
        fullname: 'Customer User 2',
        phonenumber: '0987654321',
        role_id: roles[2]._id // customer role
      }
    ];

    for (const userData of testUsers) {
      let user = await User.findOne({ username: userData.username });
      if (!user) {
        user = await User.create(userData);
        console.log(`Created new user: ${userData.username}`);
      } else {
        console.log(`User already exists: ${userData.username}`);
      }
    }

    console.log('Test data setup completed successfully');
  } catch (error) {
    console.error('Error creating test data:', error);
  } finally {
    await mongoose.connection.close();
  }
};

createTestData(); 