require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./utils/dbConnect');
const Role = require('./models/Role'); // Import Role model

// Kết nối database
connectDB();

// Hàm kiểm tra kết nối và collection
async function checkConnection() {
  try {
    // Kiểm tra trạng thái kết nối
    const dbState = mongoose.connection.readyState;
    console.log('Database connection state:', 
      dbState === 0 ? 'Disconnected' :
      dbState === 1 ? 'Connected' :
      dbState === 2 ? 'Connecting' :
      dbState === 3 ? 'Disconnecting' : 'Unknown'
    );

    // Lấy tên database hiện tại
    const dbName = mongoose.connection.db.databaseName;
    console.log('Current database:', dbName);

    // Liệt kê tất cả collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));

    // Đọc dữ liệu từ collection roles sử dụng model
    const roles = await Role.find({});
    console.log('Roles data:', roles);
    
  } catch (error) {
    console.error('Error checking database:', error);
  }
}

// Gọi hàm kiểm tra khi mongoose đã kết nối
mongoose.connection.once('connected', () => {
  console.log('MongoDB connected successfully');
  checkConnection();
});

// Bắt lỗi kết nối
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});