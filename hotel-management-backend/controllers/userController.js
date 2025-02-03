const User = require('../models/User');
const Role = require('../models/Role');
const bcrypt = require('bcryptjs');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate('role_id');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    // Kiểm tra username tồn tại
    const existingUsername = await User.findOne({ username: req.body.username });
    if (existingUsername) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Kiểm tra email tồn tại
    const existingEmail = await User.findOne({ email: req.body.email });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('role_id');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Nếu có password mới thì mới cập nhật password
    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    } else {
      // Nếu không có password mới thì xóa trường password khỏi updateData
      delete updateData.password;
    }

    const user = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('role_id');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Kiểm tra xem user có tồn tại không
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Kiểm tra xem user có liên quan đến booking nào không
    const Booking = require('../models/Booking');
    const hasBookings = await Booking.exists({ customerID: id });
    if (hasBookings) {
      return res.status(400).json({ 
        message: 'Cannot delete user because they have associated bookings'
      });
    }

    // Nếu không có booking liên quan, tiến hành xóa
    await User.findByIdAndDelete(id);
    res.json({ message: 'User deleted successfully' });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.checkUsername = async (req, res) => {
  try {
    const { username } = req.query;
    const existingUser = await User.findOne({ username });
    res.json({ exists: !!existingUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.checkEmail = async (req, res) => {
  try {
    const { email } = req.query;
    const existingUser = await User.findOne({ email });
    res.json({ exists: !!existingUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 