const Booking = require('../models/Booking');
const Invoice = require('../models/Invoice');
const User = require('../models/User');
const Room = require('../models/Rooms');
const Role = require('../models/Role');

exports.getDashboardStats = async (req, res) => {
  try {
    const { revenueType = 'total' } = req.query;
    
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

    // Đếm số booking đã confirmed và chưa completed
    const confirmedBookings = await Booking.countDocuments({ 
      status: 'Confirmed',
      checkOutDate: { $gte: today } // Chỉ đếm các booking chưa checkout
    });

    // Đếm số check-in trong ngày
    const todayCheckIns = await Booking.countDocuments({
      checkInDate: {
        $gte: today,
        $lt: tomorrow
      },
      status: 'Confirmed'
    });

    // Tính toán revenue dựa trên revenueType
    let revenueMatch = {};
    
    switch (revenueType) {
      case 'daily':
        revenueMatch = {
          paymentDate: {
            $gte: today,
            $lt: tomorrow
          }
        };
        break;
      case 'monthly':
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59);
        revenueMatch = {
          paymentDate: {
            $gte: startOfMonth,
            $lte: endOfMonth
          }
        };
        break;
      case 'yearly':
        const startOfYear = new Date(today.getFullYear(), 0, 1);
        const endOfYear = new Date(today.getFullYear(), 11, 31, 23, 59, 59);
        revenueMatch = {
          paymentDate: {
            $gte: startOfYear,
            $lte: endOfYear
          }
        };
        break;
      default:
        // Tổng revenue (không cần filter theo date)
        revenueMatch = {
          paymentStatus: 'Paid'
        };
    }

    // Tính revenue theo filter
    const revenueResult = await Invoice.aggregate([
      {
        $match: {
          ...revenueMatch,
          paymentStatus: 'Paid'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' }
        }
      }
    ]);

    // Thêm thống kê về phòng
    const roomStats = await Room.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          rooms: { 
            $push: {
              roomNumber: '$roomNumber',
              roomType: '$roomType',
              status: '$status'
            }
          }
        }
      }
    ]);

    // Format lại dữ liệu phòng
    const roomOverview = {
      available: roomStats.find(s => s._id === 'Available')?.count || 0,
      occupied: roomStats.find(s => s._id === 'Occupied')?.count || 0,
      maintenance: roomStats.find(s => s._id === 'Maintenance')?.count || 0,
      reserved: roomStats.find(s => s._id === 'Reserved')?.count || 0,
      roomsByStatus: roomStats.reduce((acc, curr) => {
        acc[curr._id] = curr.rooms;
        return acc;
      }, {})
    };

    console.log('Dashboard stats:', {
      totalGuests,
      availableRooms,
      confirmedBookings,
      todayCheckIns,
      revenue: revenueResult[0]?.total || 0,
      roomOverview: roomOverview
    });

    res.json({
      totalGuests,
      availableRooms,
      confirmedBookings,
      todayCheckIns,
      revenue: revenueResult[0]?.total || 0,
      roomOverview
    });
  } catch (error) {
    console.error('Dashboard Error:', error);
    res.status(500).json({ message: error.message });
  }
}; 