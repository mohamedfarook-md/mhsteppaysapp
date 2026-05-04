// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Protect routes — verifies JWT and attaches user to req
 */
const protect = async (req, res, next) => {
  try {
    // 1. Extract token from Authorization header
    let token;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Please login to continue.',
      });
    }

    // 2. Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Session expired. Please login again.',
        });
      }
      return res.status(401).json({
        success: false,
        message: 'Invalid token. Please login again.',
      });
    }

    // 3. Find user from token
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found. Please login again.',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Contact support.',
      });
    }

    // 4. Attach user to request
    req.user = user;
    next();

  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication error. Please try again.',
    });
  }
};

/**
 * Generate JWT token for a user
 */
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

module.exports = { protect, generateToken };