const express = require('express');
const transactionController = require('../controllers/transactionController');
const authController = require('../controllers/authController');
const router = express.Router();

// Protect all routes
router.use(authController.protect);

router.post('/transfer', transactionController.transfer);
router.get('/:accountId/history', transactionController.getTransactionHistory);

module.exports = router;