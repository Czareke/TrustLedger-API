const express = require('express');
const cardController = require('../controllers/cardController');
const authController = require('../controllers/authController');
const router = express.Router();

// Protect all routes
router.use(authController.protect);

router.post('/request', cardController.requestCard);
router.get('/my-cards', cardController.getMyCards);
router.patch('/:cardId/activate', cardController.activateCard);
router.patch('/:cardId/block', cardController.blockCard);

module.exports = router;