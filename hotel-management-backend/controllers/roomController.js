const Room = require('../models/Rooms');
const Booking = require('../models/Booking');
const mongoose = require('mongoose');

// Get all rooms
exports.getAllRooms = async (req, res) => {
    try {
        const rooms = await Room.find();
        res.json(rooms);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create new room
exports.createRoom = async (req, res) => {
    try {
        const { dailyPrice, hourlyPrice } = req.body;

        // Kiểm tra tỉ lệ giá
        if (dailyPrice < hourlyPrice * 20) {
            return res.status(400).json({ 
                message: 'Daily price must be at least 20 times the hourly price' 
            });
        }

        // Kiểm tra số phòng đã tồn tại chưa
        const existingRoom = await Room.findOne({ roomNumber: req.body.roomNumber });
        if (existingRoom) {
            return res.status(400).json({ 
                message: `Room number ${req.body.roomNumber} already exists. Please choose a different room number.` 
            });
        }

        const room = new Room(req.body);
        const newRoom = await room.save();
        res.status(201).json(newRoom);
    } catch (error) {
        // Xử lý lỗi duplicate key nếu có
        if (error.code === 11000) {
            return res.status(400).json({ 
                message: `Room number ${req.body.roomNumber} already exists. Please choose a different room number.`
            });
        }
        res.status(400).json({ message: error.message });
    }
};

// Get room by ID
exports.getRoomById = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
        res.json(room);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update room
exports.updateRoom = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const room = await Room.findById(req.params.id);
        if (!room) {
            throw new Error('Room not found');
        }

        const { dailyPrice, hourlyPrice } = req.body;

        // Kiểm tra tỉ lệ giá
        if (dailyPrice < hourlyPrice * 20) {
            return res.status(400).json({ 
                message: 'Daily price must be at least 20 times the hourly price' 
            });
        }

        // Kiểm tra nếu đang thay đổi status
        if (req.body.status && req.body.status !== room.status) {
            const activeBookings = await Booking.find({
                roomID: room._id,
                status: { $in: ['Pending', 'Confirmed'] },
                checkOutDate: { $gte: new Date() }
            });

            if (activeBookings.length > 0) {
                return res.status(400).json({
                    message: 'Cannot change room status. Room has active bookings.',
                    bookings: activeBookings
                });
            }
        }

        Object.assign(room, req.body);
        const updatedRoom = await room.save({ session });
        await session.commitTransaction();
        res.json(updatedRoom);

    } catch (error) {
        await session.abortTransaction();
        res.status(400).json({ message: error.message });
    } finally {
        session.endSession();
    }
};

// Delete room
exports.deleteRoom = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Kiểm tra xem phòng có trong booking nào không
        const existingBookings = await Booking.find({
            roomID: req.params.id,
            status: { $in: ['Pending', 'Confirmed'] } // Chỉ kiểm tra các booking chưa cancelled
        });

        if (existingBookings.length > 0) {
            return res.status(400).json({ 
                message: 'Cannot delete room. Room is currently in use in active bookings.',
                bookings: existingBookings.map(booking => ({
                    bookingId: booking._id,
                    checkInDate: booking.checkInDate,
                    checkOutDate: booking.checkOutDate,
                    status: booking.status
                }))
            });
        }

        // Nếu không có booking nào đang sử dụng, tiến hành xóa phòng
        const room = await Room.findByIdAndDelete(req.params.id, { session });
        
        if (!room) {
            throw new Error('Room not found');
        }

        // Xóa thành công
        await session.commitTransaction();
        res.json({ 
            message: 'Room deleted successfully',
            deletedRoom: room
        });

    } catch (error) {
        await session.abortTransaction();
        res.status(error.message === 'Room not found' ? 404 : 500).json({ 
            message: error.message 
        });
    } finally {
        session.endSession();
    }
};

// Thêm endpoint mới để kiểm tra bookings
exports.checkRoomBookings = async (req, res) => {
    try {
        const activeBookings = await Booking.find({
            roomID: req.params.id,
            status: { $in: ['Pending', 'Confirmed'] },
            checkOutDate: { $gte: new Date() }
        });

        res.json({
            hasActiveBookings: activeBookings.length > 0,
            bookings: activeBookings
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 