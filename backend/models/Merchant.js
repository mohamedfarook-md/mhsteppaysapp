// models/Merchant.js
const mongoose = require('mongoose');

const merchantSchema = new mongoose.Schema(
  {
    merchantId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      default: '',
    },

    upiId: {
      type: String,
      default: '',
    },

    mobile: {
      type: String,
      default: '',
    },

    email: {
      type: String,
      default: '',
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Merchant', merchantSchema);