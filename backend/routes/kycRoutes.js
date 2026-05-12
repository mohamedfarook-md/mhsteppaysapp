// // routes/authRoutes.js
// const express = require('express');
// const router = express.Router();
// const { register, login, getProfile } = require('../controllers/authController');
// const { protect } = require('../middleware/auth');

// // POST /api/auth/register
// router.post('/register', register);

// // POST /api/register (also needed — frontend uses /register without /auth prefix)
// // Handled in server.js separately

// // POST /api/auth/login
// router.post('/login', login);

// // GET /api/auth/profile (Protected)
// router.get('/profile', protect, getProfile);

// module.exports = router;









const express = require('express');

const router = express.Router();

const {
  uploadKYC,
  getKYCStatus,
  reviewKYC,
} = require('../controllers/kycController');

const kycUpload = require('../utils/multerConfig');

const { protect } = require('../middleware/auth');

// 🚀 KYC Upload (NO LOGIN REQUIRED)
router.post(
  '/upload',
  kycUpload.fields([
    { name: 'aadhaar', maxCount: 1 },
    { name: 'pan', maxCount: 1 },
  ]),
  uploadKYC
);

// 🚀 Get KYC Status (LOGIN REQUIRED)
router.get(
  '/status',
  protect,
  getKYCStatus
);

// 🚀 Admin Review KYC
router.patch(
  '/review',
  protect,
  reviewKYC
);

module.exports = router;