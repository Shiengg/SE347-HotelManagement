const Room = require('../models/Rooms');
const Booking = require('../models/Booking');
const mongoose = require('mongoose');
const cloudinary = require('../config/cloudinary');

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
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { dailyPrice, hourlyPrice, images } = req.body;

        // Kiểm tra tỉ lệ giá
        if (dailyPrice < hourlyPrice * 20) {
            return res.status(400).json({ 
                message: 'Daily price must be at least 20 times the hourly price' 
            });
        }

        // Upload images to cloudinary
        const uploadedImages = [];
        if (images && images.length > 0) {
            for (let image of images) {
                try {
                    // Kiểm tra nếu image là base64 string
                    if (typeof image === 'string' && image.startsWith('data:')) {
                        const result = await cloudinary.uploader.upload(image, {
                            folder: 'hotel-rooms',
                        });
                        uploadedImages.push({
                            public_id: result.public_id,
                            url: result.secure_url
                        });
                    }
                } catch (uploadError) {
                    console.error('Error uploading to cloudinary:', uploadError);
                    throw new Error('Failed to upload images');
                }
            }
        }

        const roomData = {
            ...req.body,
            images: uploadedImages
        };
        delete roomData.deletedImages; // Xóa trường không cần thiết

        const room = new Room(roomData);
        const newRoom = await room.save({ session });
        await session.commitTransaction();
        res.status(201).json(newRoom);
    } catch (error) {
        await session.abortTransaction();
        console.error('Error creating room:', error);
        res.status(500).json({ 
            message: error.message || 'Failed to create room',
            error: error.toString()
        });
    } finally {
        session.endSession();
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
        const { id } = req.params;
        const { dailyPrice, hourlyPrice, images, deletedImages } = req.body;

        const room = await Room.findById(id);
        if (!room) {
            throw new Error('Room not found');
        }

        // Kiểm tra tỉ lệ giá
        if (dailyPrice < hourlyPrice * 20) {
            return res.status(400).json({ 
                message: 'Daily price must be at least 20 times the hourly price' 
            });
        }

        // Xóa ảnh cũ nếu có yêu cầu
        if (deletedImages && deletedImages.length > 0) {
            for (let image of deletedImages) {
                if (image.public_id) {
                    await cloudinary.uploader.destroy(image.public_id);
                }
            }
        }

        // Giữ lại các ảnh cũ không bị xóa
        const remainingImages = room.images.filter(img => 
            !deletedImages?.some(delImg => delImg.public_id === img.public_id)
        );

        // Upload ảnh mới
        const uploadedImages = [...remainingImages];
        if (images && images.length > 0) {
            for (let image of images) {
                // Chỉ upload ảnh mới (base64)
                if (typeof image === 'string' && image.startsWith('data:')) {
                    const result = await cloudinary.uploader.upload(image, {
                        folder: 'hotel-rooms',
                    });
                    uploadedImages.push({
                        public_id: result.public_id,
                        url: result.secure_url
                    });
                }
            }
        }

        const updateData = {
            ...req.body,
            images: uploadedImages
        };
        delete updateData.deletedImages; // Xóa trường không cần thiết

        const updatedRoom = await Room.findByIdAndUpdate(
            id,
            updateData,
            { new: true, session }
        );

        await session.commitTransaction();
        res.json(updatedRoom);

    } catch (error) {
        await session.abortTransaction();
        console.error('Error updating room:', error);
        res.status(500).json({ message: error.message });
    } finally {
        session.endSession();
    }
};

// Delete room
exports.deleteRoom = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const room = await Room.findById(req.params.id);
        if (!room) {
            throw new Error('Room not found');
        }

        // Xóa ảnh trên cloudinary
        if (room.images && room.images.length > 0) {
            for (let image of room.images) {
                await cloudinary.uploader.destroy(image.public_id);
            }
        }

        // Kiểm tra và xóa room
        const existingBookings = await Booking.find({
            roomID: req.params.id,
            status: { $in: ['Pending', 'Confirmed'] }
        });

        if (existingBookings.length > 0) {
            return res.status(400).json({ 
                message: 'Cannot delete room. Room is currently in use.',
                bookings: existingBookings
            });
        }

        await Room.findByIdAndDelete(req.params.id, { session });
        
        await session.commitTransaction();
        res.json({ message: 'Room deleted successfully' });

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