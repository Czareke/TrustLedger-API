const express = require('express');
const adminController = require('../controllers/adminController');
const authController = require('../controllers/authController');
const router = express.Router();

// Protect all routes and restrict to admin only
router.use(authController.protect);
router.use(authController.restrictTo('admin'));

router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserById);
router.patch('/users/:id', adminController.updateUser);
router.get('/stats', adminController.getSystemStats);
router.get('/audit-logs', adminController.getAuditLogs);
router.patch('/accounts/:accountId/freeze', adminController.freezeAccount);
router.patch('/accounts/:accountId/adjust-balance', adminController.adjustBalance);

module.exports = router;