// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { register, login, getProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// POST /api/auth/register
router.post('/register', register);

// POST /api/register (also needed — frontend uses /register without /auth prefix)
// Handled in server.js separately

// POST /api/auth/login
router.post('/login', login);

// GET /api/auth/profile (Protected)
router.get('/profile', protect, getProfile);

module.exports = router;