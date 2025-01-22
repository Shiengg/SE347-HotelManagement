const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.get('/', invoiceController.getInvoices);
router.get('/:id', invoiceController.getInvoiceById);
router.get('/customer/:id', invoiceController.getCustomerInvoices);
router.delete('/:id',invoiceController.deleteInvoice);

module.exports = router; 