// controllers/paymentController.js
const Transaction = require('../models/Transaction');
const Merchant = require('../models/Merchant');
const { generatePayuHash, verifyPayuResponseHash, generateTxnId } = require('../utils/payuHash');

const sendResponse = (res, statusCode, success, message, data = {}) => {
  return res.status(statusCode).json({ success, message, data });
};

// ─── POST /api/payment/initiate ───────────────────────────────────────────────
/**
 * Initiate PayU payment
 * Body: { amount, merchantId?, customerName?, customerEmail?, customerPhone? }
 */
const initiatePayment = async (req, res) => {
  try {
    // const { amount, merchantId, customerName, customerEmail, customerPhone } = req.body;
    const { amount, merchantId, merchantName, customerName, customerEmail, customerPhone } = req.body;
    const user = req.user;

    // ── Validate amount ─────────────────────────────────────────────────────
    const numAmount = parseFloat(amount);
    if (!amount || isNaN(numAmount) || numAmount < 1) {
      return sendResponse(res, 400, false, 'Valid amount (minimum ₹1) is required.');
    }
    if (numAmount > 500000) {
      return sendResponse(res, 400, false, 'Maximum payment amount is ₹5,00,000.');
    }

    // ── PayU credentials ────────────────────────────────────────────────────
    const PAYU_KEY = process.env.PAYU_KEY;
    const PAYU_BASE_URL = process.env.PAYU_BASE_URL || 'https://secure.payu.in/_payment';
    const APP_URL = process.env.APP_URL || 'https://mhsteppaysapp.in';

    if (!PAYU_KEY || !process.env.PAYU_SALT) {
      console.error('❌ PayU credentials not configured');
      return sendResponse(res, 500, false, 'Payment gateway not configured. Contact support.');
    }

    // ── Build payment data ──────────────────────────────────────────────────
    const txnid = generateTxnId();
    const formattedAmount = numAmount.toFixed(2);

    const firstname = customerName || user.name;
    const email = customerEmail || user.email || `${user.mobile}@steppays.in`;
    const phone = customerPhone || user.mobile;
    const productinfo = merchantId
      ? `Payment to ${merchantId}`
      : 'StepPays Payment';

    // ── Generate hash ───────────────────────────────────────────────────────
    const hash = generatePayuHash({
      key: PAYU_KEY,
      txnid,
      amount: formattedAmount,
      productinfo,
      firstname,
      email,
    });

    let merchantName = merchantId || 'Payment';

// if (merchantId) {
//   const merchantData = await Merchant.findOne({ merchantId });
//   console.log("MERCHANT FETCH:", merchantData);

//   if (merchantData && merchantData.name) {
//     merchantName = merchantData.name;
//   }
// }
// let merchantName = 'Payment';

// if (merchantId && typeof merchantId === "string") {
//   try {
//     const merchantData = await Merchant.findOne({ merchantId });

//     console.log("MERCHANT FETCH:", merchantData);

//     if (merchantData && merchantData.name) {
//       merchantName = merchantData.name;
//     } else {
//       merchantName = merchantId; // fallback
//     }

//   } catch (error) {
//     console.log("MERCHANT ERROR:", error);
//     merchantName = merchantId || 'Payment';
//   }
// }

    // ── Save pending transaction ────────────────────────────────────────────

    await Transaction.create({
  userId: user._id,
  txnId: txnid,
  merchantId: merchantId || '',
  merchant: merchantName, // 🔥 FIXED
  amount: numAmount,
  status: 'pending',
  type: 'payu',
  customerName: firstname,
  customerEmail: email,
  customerPhone: phone,
  hash,
});

    console.log(`✅ Payment initiated: ${txnid} | ₹${formattedAmount} | User: ${user.mobile}`);

    // ── Return PayU redirect data ───────────────────────────────────────────
    return sendResponse(res, 200, true, 'Payment initiated successfully.', {
      payuUrl: PAYU_BASE_URL,
      key: PAYU_KEY,
      txnid,
      amount: formattedAmount,
      productinfo,
      firstname,
      email,
      phone,
      surl: `${APP_URL}/api/payment/success`,  // Success redirect URL
      furl: `${APP_URL}/api/payment/failure`,   // Failure redirect URL
      hash,
    });

  } catch (error) {
    console.error('Payment initiation error:', error);
    return sendResponse(res, 500, false, 'Payment initiation failed. Please try again.');
  }
};

// ─── POST /api/payment/success ────────────────────────────────────────────────
/**
 * PayU success callback
 * This is called by PayU after successful payment (POST form submit)
 */
const paymentSuccess = async (req, res) => {
  try {
    const payuResponse = req.body;

    const {
      txnid,
      amount,
      status,
      mode: paymentMode,
      mihpayid,
    } = payuResponse;

    console.log(`💳 PayU success callback received: ${txnid}`);

    // ── CRITICAL: Verify hash to prevent tampering ──────────────────────────
    const isValidHash = verifyPayuResponseHash(payuResponse);
    if (!isValidHash) {
      console.error(`❌ Hash mismatch for txnid: ${txnid} — possible tampering!`);
      // Still find and mark as failed to flag suspicious activity
      await Transaction.findOneAndUpdate(
        { txnId: txnid },
        {
          status: 'failed',
          failureReason: 'Hash verification failed - possible tampering',
          payuResponse,
        }
      );
      return res.status(400).send('Invalid payment signature');
    }

    // ── Update transaction in DB ────────────────────────────────────────────
    const txn = await Transaction.findOneAndUpdate(
      { txnId: txnid },
      {
        status: status === 'success' ? 'success' : 'failed',
        paymentMode: paymentMode || '',
        payuResponse: {
          mihpayid,
          txnid,
          amount,
          status,
          mode: paymentMode,
          rawResponse: payuResponse,
        },
        failureReason: status !== 'success' ? (payuResponse.error_Message || '') : '',
      },
      { new: true }
    );

    if (!txn) {
      console.warn(`⚠️  Transaction not found for txnid: ${txnid}`);
    }

    console.log(`✅ Payment ${status}: ${txnid} | ₹${amount}`);

    // ── Redirect to app or return JSON (depends on integration type) ─────────
    // For mobile apps using Linking.openURL, return JSON
    // For web redirect, redirect to success page
    // const successUrl = `${process.env.APP_URL}/payment-status?txnid=${txnid}&status=success`;
    // return res.redirect(successUrl);
return res.send(`
  <html>
    <body>
      <script>
        window.location.href = "${process.env.APP_URL}/api/payment/success?txnid=${txnid}";
      </script>
    </body>
  </html>
`);
  } catch (error) {
    console.error('Payment success callback error:', error);
    return res.status(500).send('Error processing payment');
  }
};

// ─── POST /api/payment/failure ────────────────────────────────────────────────
/**
 * PayU failure callback
 */
const paymentFailure = async (req, res) => {
  try {
    const payuResponse = req.body;
    const { txnid, error_Message } = payuResponse;

    console.log(`❌ PayU failure callback: ${txnid}`);

    await Transaction.findOneAndUpdate(
      { txnId: txnid },
      {
        status: 'failed',
        failureReason: error_Message || 'Payment failed',
        payuResponse,
      }
    );

    // const failUrl = `${process.env.APP_URL}/payment-status?txnid=${txnid}&status=failed`;
    // return res.redirect(failUrl);
return res.send(`
  <html>
    <body>
      <script>
        window.location.href = "${process.env.APP_URL}/api/payment/failure?txnid=${txnid}";
      </script>
    </body>
  </html>
`);
  } catch (error) {
    console.error('Payment failure callback error:', error);
    return res.status(500).send('Error processing failure');
  }
};

// ─── GET /api/public/:merchantId ──────────────────────────────────────────────
/**
 * Public: Get merchant info by ID (used by Payment screen QR scan)
 */
const getMerchantInfo = async (req, res) => {
  try {
    const { merchantId } = req.params;

    const merchant = await Merchant.findOne({ merchantId, isActive: true });

    if (!merchant) {
      // Return a basic fallback so payment screen doesn't break
      return sendResponse(res, 200, true, 'Merchant info', {
        merchant: {
          merchantId,
          name: merchantId,
          category: '',
        },
      });
    }

    return sendResponse(res, 200, true, 'Merchant found.', { merchant });

  } catch (error) {
    console.error('Get merchant error:', error);
    return sendResponse(res, 500, false, 'Failed to fetch merchant info.');
  }
};

module.exports = { initiatePayment, paymentSuccess, paymentFailure, getMerchantInfo };