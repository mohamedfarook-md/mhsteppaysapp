// utils/multerConfig.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = process.env.UPLOAD_PATH || './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Separate folder per user
    const userDir = path.join(uploadDir, req.user._id.toString());
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }
    cb(null, userDir);
  },

  filename: (req, file, cb) => {
    // Format: aadhaar_<userId>_<timestamp>.jpg
    const fieldName = file.fieldname; // 'aadhaar' or 'pan'
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    const filename = `${fieldName}_${req.user._id}_${Date.now()}${ext}`;
    cb(null, filename);
  },
});

// File filter — only accept images
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error('Only JPG, JPEG, and PNG files are allowed'), false);
  }

  cb(null, true);
};

const MAX_SIZE_MB = parseInt(process.env.MAX_FILE_SIZE_MB || '5');

const kycUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_SIZE_MB * 1024 * 1024, // Convert MB to bytes
    files: 2, // Max 2 files (aadhaar + pan)
  },
});

// Export configured upload for KYC (aadhaar + pan)
module.exports = kycUpload;