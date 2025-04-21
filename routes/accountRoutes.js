const express = require('express');
const accountController = require('../controllers/accountController');
const authController = require('../controllers/authController');
const router = express.Router();

// Protect all routes
router.use(authController.protect);

router.post('/', accountController.createAccount);
router.get('/', accountController.getMyAccounts);
router.get('/:accountId/balance', accountController.getAccountBalance);
router.patch('/:accountId/close', accountController.closeAccount);

module.exports = router;