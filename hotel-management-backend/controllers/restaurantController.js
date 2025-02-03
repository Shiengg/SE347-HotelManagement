const RestaurantItem = require('../models/Restaurant');

// Lấy tất cả món ăn
exports.getAllItems = async (req, res) => {
  try {
    const items = await RestaurantItem.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Tạo món ăn mới
exports.createItem = async (req, res) => {
  try {
    // Kiểm tra xem tên món ăn đã tồn tại chưa
    const existingItem = await RestaurantItem.findOne({ 
      name: { $regex: new RegExp(`^${req.body.name}$`, 'i') } 
    });
    
    if (existingItem) {
      return res.status(400).json({ 
        message: `Menu item "${req.body.name}" already exists. Please choose a different name.` 
      });
    }

    const item = new RestaurantItem(req.body);
    const newItem = await item.save();
    res.status(201).json(newItem);
  } catch (error) {
    // Xử lý lỗi duplicate key nếu có
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: `Menu item "${req.body.name}" already exists. Please choose a different name.`
      });
    }
    res.status(400).json({ message: error.message });
  }
};

// Lấy món ăn theo ID
exports.getItemById = async (req, res) => {
  try {
    const item = await RestaurantItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cập nhật món ăn
exports.updateItem = async (req, res) => {
  try {
    const item = await RestaurantItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Nếu tên được cập nhật, kiểm tra xem có trùng không
    if (req.body.name && req.body.name !== item.name) {
      const existingItem = await RestaurantItem.findOne({ 
        name: { $regex: new RegExp(`^${req.body.name}$`, 'i') },
        _id: { $ne: req.params.id } // Loại trừ item hiện tại
      });
      
      if (existingItem) {
        return res.status(400).json({ 
          message: `Menu item "${req.body.name}" already exists. Please choose a different name.` 
        });
      }
    }

    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'description', 'price', 'category', 'image', 'isAvailable'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({ message: 'Invalid updates!' });
    }

    const updatedItem = await RestaurantItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedItem);
  } catch (error) {
    // Xử lý lỗi duplicate key nếu có
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: `Menu item "${req.body.name}" already exists. Please choose a different name.`
      });
    }
    res.status(400).json({ message: error.message });
  }
};

// Xóa món ăn
exports.deleteItem = async (req, res) => {
  try {
    const item = await RestaurantItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    await RestaurantItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy món ăn theo category
exports.getItemsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const items = await RestaurantItem.find({ category });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Thêm controller xử lý upload ảnh
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    res.json({ imageUrl: req.file.path });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 