// routes/supportRoutes.js
const express = require('express');
const router = express.Router();
const { submitTicket } = require('../controllers/supportController');
const { protect } = require('../middleware/auth');

// POST /api/support/ticket (Protected)
router.post('/ticket', protect, submitTicket);

module.exports = router;