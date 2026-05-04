// utils/payuHash.js
const crypto = require('crypto');

/**
 * Generate PayU payment hash
 *
 * PayU Hash Formula (for request):
 * SHA512(key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||SALT)
 *
 * PayU Hash Formula (for response verification):
 * SHA512(SALT|status||||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key)
 */

/**
 * Generate hash for payment initiation
 */
const generatePayuHash = ({
  key,
  txnid,
  amount,
  productinfo,
  firstname,
  email,
  udf1 = '',
  udf2 = '',
  udf3 = '',
  udf4 = '',
  udf5 = '',
}) => {
  const salt = process.env.PAYU_SALT;

  if (!salt) {
    throw new Error('PAYU_SALT not configured in environment');
  }

  // PayU requires amount with exactly 2 decimal places
  const formattedAmount = parseFloat(amount).toFixed(2);

  const hashString = [
    key,
    txnid,
    formattedAmount,
    productinfo,
    firstname,
    email,
    udf1,
    udf2,
    udf3,
    udf4,
    udf5,
    '', '', '', '', '', // Mandatory empty strings
    salt,
  ].join('|');

  return crypto.createHash('sha512').update(hashString).digest('hex');
};

/**
 * Verify hash from PayU response (success/failure callback)
 * This is CRITICAL for payment security - always verify before saving
 */
const verifyPayuResponseHash = (payuResponse) => {
  const salt = process.env.PAYU_SALT;

  if (!salt) {
    throw new Error('PAYU_SALT not configured in environment');
  }

  const {
    status,
    key,
    txnid,
    amount,
    productinfo,
    firstname,
    email,
    udf1 = '',
    udf2 = '',
    udf3 = '',
    udf4 = '',
    udf5 = '',
    hash: receivedHash,
  } = payuResponse;

  // PayU reverse hash formula for verification
  const hashString = [
    salt,
    status,
    '', '', '', '', '', // Mandatory empty strings
    udf5,
    udf4,
    udf3,
    udf2,
    udf1,
    email,
    firstname,
    productinfo,
    amount,
    txnid,
    key,
  ].join('|');

  const calculatedHash = crypto
    .createHash('sha512')
    .update(hashString)
    .digest('hex');

  return calculatedHash === receivedHash;
};

/**
 * Generate unique transaction ID
 * Format: SP + timestamp + random 6 chars
 */
const generateTxnId = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `SP${timestamp}${random}`;
};

module.exports = { generatePayuHash, verifyPayuResponseHash, generateTxnId };