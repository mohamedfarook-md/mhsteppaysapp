// routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  initiatePayment,
  paymentSuccess,
  paymentFailure,
  getMerchantInfo,
  initiateUPIPayment,
  markUPISuccess
} = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');


// POST /api/payment/initiate (Protected)
router.post('/initiate', protect, initiatePayment);

// POST /api/payment/success — PayU callback (NOT protected, called by PayU)
router.post('/success', paymentSuccess);

// POST /api/payment/failure — PayU callback (NOT protected, called by PayU)
router.post('/failure', paymentFailure);

// GET /api/public/:merchantId — Public merchant info lookup (for QR scan)
// Note: Registered as /api/public/:merchantId in server.js

router.post('/upi-initiate', auth, initiateUPIPayment);
router.post('/upi-success', auth, markUPISuccess);

module.exports = router;