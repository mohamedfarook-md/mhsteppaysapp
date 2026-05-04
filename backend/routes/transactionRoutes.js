// routes/transactionRoutes.js
const express = require('express');
const router = express.Router();
const { getUserTransactions, getTransactionById } = require('../controllers/transactionController');
const { protect } = require('../middleware/auth');

// GET /api/transactions/user (Protected)
// Frontend service: GET /transactions/user
router.get('/user', protect, getUserTransactions);

// GET /api/transactions/:txnId (Protected)
router.get('/:txnId', protect, getTransactionById);

module.exports = router;