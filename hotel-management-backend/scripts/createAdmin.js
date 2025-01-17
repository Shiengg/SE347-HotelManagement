const User = require('../models/User');
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI);

async function createAdmin() {
    try {
        const admin = new User({
            username: 'admin',
            password: 'admin123', // Sẽ được hash tự động
            name: 'Admin User',
            email: 'admin@example.com',
            role: 'admin'
        });

        await admin.save();
        console.log('Admin user created successfully');
    } catch (error) {
        console.error('Error creating admin:', error);
    } finally {
        mongoose.disconnect();
    }
}

createAdmin(); 