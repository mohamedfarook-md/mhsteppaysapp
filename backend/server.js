// server.js — StepPays Backend Entry Point
require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const path = require('path');
const connectDB = require('./config/db');

// ─── Import Routes ────────────────────────────────────────────────────────────
const authRoutes = require('./routes/authRoutes');
const kycRoutes = require('./routes/kycRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const supportRoutes = require('./routes/supportRoutes');

// ─── Import Controllers ───────────────────────────────────────────────────────
const { getMerchantInfo } = require('./controllers/paymentController');
const { register } = require('./controllers/authController');

const app = express();

// ─── Connect Database ─────────────────────────────────────────────────────────
connectDB();

// ─── Security Middleware ──────────────────────────────────────────────────────

// Helmet: sets secure HTTP headers
app.use(helmet());

// CORS: allow React Native app to connect
app.use(cors({
  origin: '*', // In production, restrict to your app domain
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate limiting: prevent brute-force attacks
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: { success: false, message: 'Too many requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter limiter for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // Max 20 login attempts per 15 min
  message: { success: false, message: 'Too many login attempts. Please wait 15 minutes.' },
});

app.use(globalLimiter);

// ─── Body Parsers ─────────────────────────────────────────────────────────────
// For PayU callbacks (form POST)
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
// For JSON API requests
app.use(express.json({ limit: '10mb' }));

// ─── Static Files (KYC uploads — secured) ────────────────────────────────────
// Note: In production, KYC images should be served via authenticated endpoints
// or stored in S3/Cloudinary, NOT publicly exposed
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── API Routes ───────────────────────────────────────────────────────────────

// Auth routes
app.use('/api/auth', authLimiter, authRoutes);

// ✅ Frontend uses POST /api/register (not /api/auth/register)
app.post('/api/register', authLimiter, register);

// KYC routes
app.use('/api/kyc', kycRoutes);

// Payment routes
app.use('/api/payment', paymentRoutes);

// ✅ Frontend Payment.js: GET /api/public/:merchantId
app.get('/api/public/:merchantId', getMerchantInfo);

// Transaction routes
app.use('/api/transactions', transactionRoutes);

// Support routes
app.use('/api/support', supportRoutes);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'StepPays API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

app.get('/', (req, res) => {
  res.json({ success: true, message: 'Welcome to StepPays API' });
});

// ─── PayU Payment Status Page (for redirect after payment) ───────────────────
app.get('/payment-status', (req, res) => {
  const { txnid, status } = req.query;
  // Return a simple HTML page or JSON that the mobile app can handle
  res.json({
    success: status === 'success',
    message: status === 'success' ? 'Payment completed' : 'Payment failed',
    data: { txnid, status },
  });
});

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found`,
    data: {},
  });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);

  // Don't expose internal errors in production
  const message = process.env.NODE_ENV === 'production'
    ? 'Internal server error'
    : err.message;

  res.status(err.status || 500).json({
    success: false,
    message,
    data: {},
  });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════╗
║     StepPays Backend Server Started      ║
╠══════════════════════════════════════════╣
║  Port    : ${PORT}                            ║
║  Mode    : ${process.env.NODE_ENV || 'development'}                   ║
║  Base URL: https://mhsteppaysapp.in/api    ║
╚══════════════════════════════════════════╝
  `);
});

// ─── Graceful Shutdown ────────────────────────────────────────────────────────
process.on('SIGTERM', () => {
  console.log('⚠️  SIGTERM received. Closing server...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled rejection:', err);
  server.close(() => process.exit(1));
});

module.exports = app;