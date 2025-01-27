const Booking = require('../models/Booking');
const Invoice = require('../models/Invoice');
const User = require('../models/User');
const Room = require('../models/Rooms');
const Role = require('../models/Role');

exports.getDashboardStats = async (req, res) => {
  try {
    // Lấy role_id của customer
    const customerRole = await Role.findOne({ role_name: 'customer' });
    
    if (!customerRole) {
      console.log('Customer role not found');
      return res.status(500).json({ message: 'Customer role not found' });
    }

    // Đếm số lượng khách (users với role là customer)
    const totalGuests = await User.countDocuments({
      role_id: customerRole._id
    });

    // Đếm số phòng đang available
    const availableRooms = await Room.countDocuments({ 
      status: 'Available' 
    });

    // Đếm số booking đã confirmed
    const confirmedBookings = await Booking.countDocuments({ 
      status: 'Confirmed' 
    });

    // Tính tổng tiền của tất cả hóa đơn
    const totalRevenue = await Invoice.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' }
        }
      }
    ]);

    // Lấy 5 booking gần nhất
    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('customerID', 'fullname')
      .populate('roomID', 'roomNumber');

    console.log('Dashboard stats:', {
      totalGuests,
      availableRooms,
      confirmedBookings,
      totalRevenue: totalRevenue[0]?.total || 0,
      recentBookings: recentBookings.length
    });

    res.json({
      totalGuests,
      availableRooms,
      confirmedBookings,
      totalRevenue: totalRevenue[0]?.total || 0,
      recentBookings
    });
  } catch (error) {
    console.error('Dashboard Error:', error);
    res.status(500).json({ message: error.message });
  }
}; 