const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, userController.getAllUsers);
router.post('/', authMiddleware, userController.createUser);
router.get('/:id', authMiddleware, userController.getUserById);
router.put('/:id', authMiddleware, userController.updateUser);
router.delete('/:id', authMiddleware, userController.deleteUser);
router.get('/check-username', authMiddleware, userController.checkUsername);
router.get('/check-email', authMiddleware, userController.checkEmail);
router.post('/register', userController.registerCustomer);
router.get('/:id/check-bookings', authMiddleware, userController.checkUserHasBookings);

module.exports = router; 