// controllers/transactionController.js
const Transaction = require('../models/Transaction');

const sendResponse = (res, statusCode, success, message, data = {}) => {
  return res.status(statusCode).json({ success, message, data });
};

// ─── GET /api/transactions/user ───────────────────────────────────────────────
/**
 * Get all transactions for logged-in user (Protected)
 * Frontend History.js calls: GET /transactions/user
 */
const getUserTransactions = async (req, res) => {
  try {
    const userId = req.user._id;

    // Optional query params for filtering
    const { status, limit = 50, page = 1 } = req.query;

    const query = { userId };
    if (status && ['pending', 'success', 'failed', 'processing'].includes(status)) {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [transactions, total] = await Promise.all([
      Transaction.find(query)
        .select('-hash -payuResponse.rawResponse') // Don't expose sensitive fields
        .sort({ createdAt: -1 }) // Latest first
        .limit(parseInt(limit))
        .skip(skip)
        .lean(),
      Transaction.countDocuments(query),
    ]);

    return sendResponse(res, 200, true, 'Transactions fetched.', {
      transactions,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });

  } catch (error) {
    console.error('Get transactions error:', error);
    return sendResponse(res, 500, false, 'Failed to fetch transactions.');
  }
};

// ─── GET /api/transactions/:txnId ────────────────────────────────────────────
/**
 * Get single transaction by txnId (Protected — user can only see their own)
 */
const getTransactionById = async (req, res) => {
  try {
    const { txnId } = req.params;
    const userId = req.user._id;

    const txn = await Transaction.findOne({ txnId, userId })
      .select('-hash');

    if (!txn) {
      return sendResponse(res, 404, false, 'Transaction not found.');
    }

    return sendResponse(res, 200, true, 'Transaction found.', { transaction: txn });

  } catch (error) {
    console.error('Get transaction error:', error);
    return sendResponse(res, 500, false, 'Failed to fetch transaction.');
  }
};

module.exports = { getUserTransactions, getTransactionById };