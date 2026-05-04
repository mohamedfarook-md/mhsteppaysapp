// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name too long'],
    },

    mobile: {
      type: String,
      required: [true, 'Mobile number is required'],
      unique: true,
      trim: true,
      match: [/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'],
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
      match: [/^\S+@\S+\.\S+$/, 'Enter a valid email address'],
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Never return password in queries by default
    },

    kyc: {
      aadhaar: { type: String, default: '' },  // File path
      pan: { type: String, default: '' },        // File path
      // Matches frontend kycStatus field exactly
      status: {
        type: String,
        enum: ['not_submitted', 'pending', 'approved', 'rejected'],
        default: 'not_submitted',
      },
      submittedAt: { type: Date },
      reviewedAt: { type: Date },
      rejectionReason: { type: String, default: '' },
    },

    // For easy querying from frontend (kycStatus field)
    kycStatus: {
      type: String,
      enum: ['not_submitted', 'pending', 'approved', 'rejected'],
      default: 'not_submitted',
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true, // Adds createdAt & updatedAt
  }
);

// ─── Hash password before saving ─────────────────────────────────────────────
userSchema.pre('save', async function (next) {
  // Only hash if password was modified
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(12); // Higher rounds = more secure
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// ─── Keep kycStatus in sync with kyc.status ──────────────────────────────────
userSchema.pre('save', function (next) {
  if (this.isModified('kyc.status')) {
    this.kycStatus = this.kyc.status;
  }
  next();
});

// ─── Instance method: compare password ───────────────────────────────────────
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// ─── Instance method: get safe public profile ────────────────────────────────
userSchema.methods.toPublicJSON = function () {
  return {
    _id: this._id,
    name: this.name,
    mobile: this.mobile,
    email: this.email,
    kycStatus: this.kycStatus,
    kyc: {
      status: this.kyc.status,
      aadhaar: this.kyc.aadhaar ? 'uploaded' : '',
      pan: this.kyc.pan ? 'uploaded' : '',
      submittedAt: this.kyc.submittedAt,
      rejectionReason: this.kyc.rejectionReason,
    },
    isActive: this.isActive,
    lastLogin: this.lastLogin,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model('User', userSchema);