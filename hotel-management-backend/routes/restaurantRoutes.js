const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../config/multer');

router.use(authMiddleware);

// Các routes cho quản lý nhà hàng
router.get('/', restaurantController.getAllItems);
router.post('/', restaurantController.createItem);
router.get('/:id', restaurantController.getItemById);
router.put('/:id', restaurantController.updateItem);
router.delete('/:id', restaurantController.deleteItem);
router.get('/category/:category', restaurantController.getItemsByCategory);
router.post('/upload', upload.single('image'), restaurantController.uploadImage);

module.exports = router; 