const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);
router.get('/stats', dashboardController.getDashboardStats);

module.exports = router; 