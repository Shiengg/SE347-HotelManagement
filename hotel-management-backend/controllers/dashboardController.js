const Booking = require('../models/Booking');
const Invoice = require('../models/Invoice');
const User = require('../models/User');
const Room = require('../models/Rooms');
const Role = require('../models/Role');

exports.getDashboardStats = async (req, res) => {
  try {
    // Lấy ngày hiện tại và đặt thời gian về 00:00:00
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Lấy ngày mai để làm mốc kết thúc
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

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

    // Đếm số check-in trong ngày
    const todayCheckIns = await Booking.countDocuments({
      checkInDate: {
        $gte: today,
        $lt: tomorrow
      },
      status: 'Confirmed'
    });

    // Tính doanh thu trong ngày (từ các invoice đã thanh toán)
    const todayRevenue = await Invoice.aggregate([
      {
        $match: {
          paymentStatus: 'Paid',
          paymentDate: {
            $gte: today,
            $lt: tomorrow
          }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' }
        }
      }
    ]);

    // Lấy danh sách booking gần đây
    const recentBookings = await Booking.find()
      .populate('customerID', 'fullname')
      .populate('roomID', 'roomNumber')
      .sort({ createdAt: -1 })
      .limit(10);

    console.log('Dashboard stats:', {
      totalGuests,
      availableRooms,
      confirmedBookings,
      todayCheckIns,
      todayRevenue: todayRevenue[0]?.total || 0,
      recentBookings: recentBookings.length
    });

    res.json({
      totalGuests,
      availableRooms,
      confirmedBookings,
      todayCheckIns,
      todayRevenue: todayRevenue[0]?.total || 0,
      recentBookings
    });
  } catch (error) {
    console.error('Dashboard Error:', error);
    res.status(500).json({ message: error.message });
  }
}; 