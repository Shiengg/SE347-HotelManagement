const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middlewares/authMiddleware');

// Sử dụng middleware xác thực
router.use(authMiddleware);

// Định nghĩa các routes
router.get('/', bookingController.getAllBookings);
router.get('/customer', bookingController.getCustomerBookings);
router.post('/', bookingController.createBooking);
router.get('/:id', bookingController.getBookingById);
router.put('/:id', bookingController.updateBooking);
router.delete('/:id', bookingController.deleteBooking);
router.put('/:bookingId/update-invoice', bookingController.updateInvoiceWithRestaurantCharges);

module.exports = router;  // Export router thay vì object 