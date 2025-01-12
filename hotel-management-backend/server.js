require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');
const connectDB = require('./utils/dbConnect');

const PORT = process.env.PORT || 5000;

// Kết nối database
connectDB();

// Khởi động server sau khi kết nối database thành công
mongoose.connection.once('connected', async () => {
  console.log('MongoDB connected successfully');
  
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

// Bắt lỗi kết nối
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});