// // routes/paymentRoutes.js
// const express = require('express');
// const router = express.Router();
// const auth = require('../middleware/auth');
// const {
//   initiatePayment,
//   paymentSuccess,
//   paymentFailure,
//   getMerchantInfo,
//   initiateUPIPayment,
//   markUPISuccess
// } = require('../controllers/paymentController');
// const { protect } = require('../middleware/auth');


// // POST /api/payment/initiate (Protected)
// router.post('/initiate', protect, initiatePayment);

// // POST /api/payment/success — PayU callback (NOT protected, called by PayU)
// router.post('/success', paymentSuccess);

// // POST /api/payment/failure — PayU callback (NOT protected, called by PayU)
// router.post('/failure', paymentFailure);

// // GET /api/public/:merchantId — Public merchant info lookup (for QR scan)
// // Note: Registered as /api/public/:merchantId in server.js

// router.post('/upi-initiate', auth, initiateUPIPayment);
// router.post('/upi-success', auth, markUPISuccess);

// module.exports = router;






































// routes/paymentRoutes.js
const express = require('express');
const router = express.Router();

// ✅ Middleware
const auth = require('../middleware/auth');
const { protect } = require('../middleware/auth');

// ✅ Controllers
const {
  initiatePayment,
  paymentSuccess,
  paymentFailure,
  getMerchantInfo,
  initiateUPIPayment,
  markUPISuccess
} = require('../controllers/paymentController');


// ─────────────────────────────────────────────
// 💳 PAYU ROUTES
// ─────────────────────────────────────────────

// POST /api/payment/initiate (Protected)
router.post('/initiate', protect, initiatePayment);

// PayU success callback (NOT protected)
router.post('/success', paymentSuccess);

// PayU failure callback (NOT protected)
router.post('/failure', paymentFailure);


// ─────────────────────────────────────────────
// ⚡ UPI DIRECT ROUTES
// ─────────────────────────────────────────────

// POST /api/payment/upi-initiate (Protected)
router.post('/upi-initiate', auth, initiateUPIPayment);

// POST /api/payment/upi-success (Protected)
router.post('/upi-success', auth, markUPISuccess);


// ─────────────────────────────────────────────
// 📦 EXPORT
// ─────────────────────────────────────────────
module.exports = router;