// controllers/authController.js
const User = require('../models/User');
const { generateToken } = require('../middleware/auth');
const validator = require('validator');

// ─── Standard response helper ─────────────────────────────────────────────────
const sendResponse = (res, statusCode, success, message, data = {}) => {
  return res.status(statusCode).json({ success, message, data });
};

// ─── POST /api/auth/register ──────────────────────────────────────────────────
/**
 * Register new user
 * Body: { name, mobile, email, password }
 */
const register = async (req, res) => {
  try {
    const { name, mobile, email, password } = req.body;

    // ── Validation ──────────────────────────────────────────────────────────
    const errors = {};

    if (!name || name.trim().length < 2) {
      errors.name = 'Full name must be at least 2 characters';
    }

    if (!mobile || !/^[6-9]\d{9}$/.test(mobile)) {
      errors.mobile = 'Enter a valid 10-digit Indian mobile number';
    }

    if (email && !validator.isEmail(email)) {
      errors.email = 'Enter a valid email address';
    }

    if (!password || password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (Object.keys(errors).length > 0) {
      return sendResponse(res, 400, false, 'Validation failed', { errors });
    }

    // ── Check duplicate mobile ──────────────────────────────────────────────
    const existingUser = await User.findOne({ mobile });
    if (existingUser) {
      return sendResponse(res, 409, false, 'Mobile number already registered. Please login.');
    }

    // ── Check duplicate email (if provided) ────────────────────────────────
    if (email) {
      const existingEmail = await User.findOne({ email: email.toLowerCase() });
      if (existingEmail) {
        return sendResponse(res, 409, false, 'Email already registered with another account.');
      }
    }

    // ── Create user (password hashed by pre-save hook in model) ────────────
    const user = await User.create({
      name: name.trim(),
      mobile: mobile.trim(),
      email: email ? email.trim().toLowerCase() : '',
      password,
    });

    // ── Generate JWT ────────────────────────────────────────────────────────
    const token = generateToken(user._id);

    console.log(`✅ New user registered: ${mobile}`);

    return sendResponse(res, 201, true, 'Registration successful! Please complete KYC.', {
      token,
      user: user.toPublicJSON(),
    });

  } catch (error) {
    console.error('Register error:', error);

    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return sendResponse(res, 409, false, `${field === 'mobile' ? 'Mobile number' : 'Email'} already registered.`);
    }

    return sendResponse(res, 500, false, 'Registration failed. Please try again.');
  }
};

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
/**
 * Login user
 * Body: { mobile, password }
 */
const login = async (req, res) => {
  try {
    const { mobile, password } = req.body;

    // ── Validation ──────────────────────────────────────────────────────────
    if (!mobile || !password) {
      return sendResponse(res, 400, false, 'Mobile number and password are required.');
    }

    if (!/^\d{10}$/.test(mobile)) {
      return sendResponse(res, 400, false, 'Enter a valid 10-digit mobile number.');
    }

    // ── Find user with password (password excluded by default) ──────────────
    const user = await User.findOne({ mobile }).select('+password');

    if (!user) {
      // Generic message to prevent user enumeration
      return sendResponse(res, 401, false, 'Invalid mobile number or password.');
    }

    if (!user.isActive) {
      return sendResponse(res, 403, false, 'Account deactivated. Please contact support.');
    }

    // ── Verify password ─────────────────────────────────────────────────────
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return sendResponse(res, 401, false, 'Invalid mobile number or password.');
    }

    // ── Update last login ───────────────────────────────────────────────────
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    // ── Generate JWT ────────────────────────────────────────────────────────
    const token = generateToken(user._id);

    console.log(`✅ User logged in: ${mobile}`);

    return sendResponse(res, 200, true, 'Login successful!', {
      token,
      user: user.toPublicJSON(),
    });

  } catch (error) {
    console.error('Login error:', error);
    return sendResponse(res, 500, false, 'Login failed. Please try again.');
  }
};

// ─── GET /api/auth/profile ────────────────────────────────────────────────────
/**
 * Get logged-in user profile (Protected)
 */
const getProfile = async (req, res) => {
  try {
    // req.user is attached by auth middleware (without password)
    const user = await User.findById(req.user._id);

    if (!user) {
      return sendResponse(res, 404, false, 'User not found.');
    }

    return sendResponse(res, 200, true, 'Profile fetched successfully.', {
      user: user.toPublicJSON(),
    });

  } catch (error) {
    console.error('Get profile error:', error);
    return sendResponse(res, 500, false, 'Failed to fetch profile.');
  }
};

module.exports = { register, login, getProfile };