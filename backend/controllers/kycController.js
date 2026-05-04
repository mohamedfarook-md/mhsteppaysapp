// controllers/kycController.js
const User = require('../models/User');
const path = require('path');
const fs = require('fs');

const sendResponse = (res, statusCode, success, message, data = {}) => {
  return res.status(statusCode).json({ success, message, data });
};

// ─── POST /api/kyc/upload ─────────────────────────────────────────────────────
/**
 * Upload KYC documents (Protected)
 * Form-data: aadhaar (image), pan (image)
 */
const uploadKYC = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return sendResponse(res, 404, false, 'User not found.');
    }

    // Prevent re-upload if already approved
    if (user.kyc.status === 'approved') {
      return sendResponse(res, 400, false, 'KYC already approved. No changes needed.');
    }

    // Check files were uploaded
    if (!req.files || !req.files.aadhaar || !req.files.pan) {
      return sendResponse(res, 400, false, 'Both Aadhaar and PAN images are required.');
    }

    const aadhaarFile = req.files.aadhaar[0];
    const panFile = req.files.pan[0];

    // If user had previous KYC uploads, clean up old files
    if (user.kyc.aadhaar && fs.existsSync(user.kyc.aadhaar)) {
      fs.unlinkSync(user.kyc.aadhaar);
    }
    if (user.kyc.pan && fs.existsSync(user.kyc.pan)) {
      fs.unlinkSync(user.kyc.pan);
    }

    // Update KYC in DB
    user.kyc.aadhaar = aadhaarFile.path;
    user.kyc.pan = panFile.path;
    user.kyc.status = 'pending';
    user.kyc.submittedAt = new Date();
    user.kycStatus = 'pending';

    await user.save({ validateBeforeSave: false });

    console.log(`✅ KYC submitted by user: ${user.mobile}`);

    return sendResponse(res, 200, true, 'KYC documents submitted successfully! Verification in progress.', {
      kycStatus: 'pending',
      submittedAt: user.kyc.submittedAt,
    });

  } catch (error) {
    console.error('KYC upload error:', error);

    // Multer specific errors
    if (error.code === 'LIMIT_FILE_SIZE') {
      return sendResponse(res, 400, false, `File too large. Maximum size is ${process.env.MAX_FILE_SIZE_MB || 5}MB.`);
    }

    if (error.message && error.message.includes('Only JPG')) {
      return sendResponse(res, 400, false, error.message);
    }

    return sendResponse(res, 500, false, 'KYC upload failed. Please try again.');
  }
};

// ─── GET /api/kyc/status ──────────────────────────────────────────────────────
/**
 * Get KYC status for logged-in user (Protected)
 */
const getKYCStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    return sendResponse(res, 200, true, 'KYC status fetched.', {
      kycStatus: user.kycStatus,
      kyc: {
        status: user.kyc.status,
        aadhaar: user.kyc.aadhaar ? 'uploaded' : 'not_uploaded',
        pan: user.kyc.pan ? 'uploaded' : 'not_uploaded',
        submittedAt: user.kyc.submittedAt,
        rejectionReason: user.kyc.rejectionReason,
      },
    });

  } catch (error) {
    console.error('KYC status error:', error);
    return sendResponse(res, 500, false, 'Failed to fetch KYC status.');
  }
};

// ─── PATCH /api/kyc/review (Admin use only — for manually approving KYC) ─────
/**
 * Admin: Approve or reject KYC
 * Body: { userId, action: 'approved' | 'rejected', reason? }
 */
const reviewKYC = async (req, res) => {
  try {
    const { userId, action, reason } = req.body;

    if (!userId || !['approved', 'rejected'].includes(action)) {
      return sendResponse(res, 400, false, 'userId and valid action (approved/rejected) required.');
    }

    const user = await User.findById(userId);
    if (!user) {
      return sendResponse(res, 404, false, 'User not found.');
    }

    user.kyc.status = action;
    user.kycStatus = action;
    user.kyc.reviewedAt = new Date();

    if (action === 'rejected' && reason) {
      user.kyc.rejectionReason = reason;
    }

    await user.save({ validateBeforeSave: false });

    console.log(`✅ KYC ${action} for user: ${user.mobile}`);

    return sendResponse(res, 200, true, `KYC ${action} successfully.`, {
      userId,
      kycStatus: action,
    });

  } catch (error) {
    console.error('KYC review error:', error);
    return sendResponse(res, 500, false, 'KYC review failed.');
  }
};

module.exports = { uploadKYC, getKYCStatus, reviewKYC };