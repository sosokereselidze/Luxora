const express = require('express');
const router = express.Router();
const {
  initiatePayment,
  handleWebhook,
  getPaymentStatus
} = require('../controllers/bogController');
const { protect } = require('../middleware/auth');

// Initiate payment (Auth required)
router.post('/pay', protect, initiatePayment);

// Webhook for BOG (No auth, BOG will call this)
router.post('/webhook', handleWebhook);

// Check payment status manually (Auth required)
router.get('/status/:orderId', protect, getPaymentStatus);

module.exports = router;
