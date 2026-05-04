// models/Transaction.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    // PayU transaction ID (unique per payment)
    txnId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    // Merchant info
    merchantId: {
      type: String,
      default: '',
    },

    merchant: {
      type: String,
      default: '',
    },

    amount: {
      type: Number,
      required: true,
      min: [1, 'Amount must be at least ₹1'],
    },

    // Payment status
    status: {
      type: String,
      enum: ['pending', 'success', 'failed', 'processing', 'cancelled'],
      default: 'pending',
    },

    // Payment method used (card, netbanking, upi, etc.)
    paymentMode: {
      type: String,
      default: '',
    },

    // Full PayU response stored for reference & reconciliation
    payuResponse: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    // Payment type: internal, upi, raw
    type: {
      type: String,
      enum: ['internal', 'upi', 'raw', 'payu'],
      default: 'payu',
    },

    // Customer info at time of payment
    customerName: { type: String, default: '' },
    customerEmail: { type: String, default: '' },
    customerPhone: { type: String, default: '' },

    // PayU hash (for audit trail)
    hash: { type: String, select: false },

    // Failure reason
    failureReason: { type: String, default: '' },
  },
  {
    timestamps: true, // createdAt & updatedAt
  }
);

// Index for fast user history queries
transactionSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Transaction', transactionSchema);