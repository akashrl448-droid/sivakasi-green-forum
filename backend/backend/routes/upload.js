const express = require('express');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

const ALLOWED_TYPES = [
  // Images
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  // Videos
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'video/x-matroska',
];

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB (supports images and video clips)

// Local upload directory fallback
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Check if AWS S3 is configured
const isS3Configured = Boolean(
  process.env.AWS_BUCKET_NAME &&
  process.env.AWS_ACCESS_KEY_ID &&
  process.env.AWS_SECRET_ACCESS_KEY
);

let s3Client = null;
if (isS3Configured) {
  s3Client = new S3Client({
    region: process.env.AWS_REGION || 'ap-south-1',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });
}

// Multer storage: Use memory storage if uploading to S3, otherwise save to local disk
const storage = isS3Configured
  ? multer.memoryStorage()
  : multer.diskStorage({
      destination: (req, file, cb) => cb(null, uploadDir),
      filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const safeName = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`;
        cb(null, safeName);
      },
    });

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_TYPES.includes(file.mimetype)) {
      return cb(new Error('Allowed formats: JPG, PNG, WEBP, GIF, SVG, MP4, WEBM, MOV'));
    }
    cb(null, true);
  },
});

/**
 * Uploads a buffer directly to AWS S3 and returns the public CloudFront/S3 URL
 */
async function uploadToS3(file) {
  const ext = path.extname(file.originalname).toLowerCase();
  const key = `uploads/${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
    CacheControl: 'public, max-age=31536000, immutable',
  });

  await s3Client.send(command);

  // If CloudFront URL is provided, format with CloudFront CDN domain; otherwise use S3 URL
  if (process.env.CLOUDFRONT_URL) {
    const cfBase = process.env.CLOUDFRONT_URL.replace(/\/+$/, '');
    return `${cfBase}/${key}`;
  }

  const region = process.env.AWS_REGION || 'ap-south-1';
  return `https://${process.env.AWS_BUCKET_NAME}.s3.${region}.amazonaws.com/${key}`;
}

// POST /api/admin/upload — single image or video upload
router.post('/', requireAuth, (req, res) => {
  upload.single('image')(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File too large — maximum size is 25MB' });
      }
      return res.status(400).json({ error: err.message });
    }
    if (err) return res.status(400).json({ error: err.message });
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    try {
      let fileUrl;
      if (isS3Configured) {
        fileUrl = await uploadToS3(req.file);
      } else {
        fileUrl = `/uploads/${req.file.filename}`;
      }

      res.status(201).json({
        url: fileUrl,
        originalName: req.file.originalname,
        size: req.file.size,
        mimeType: req.file.mimetype,
      });
    } catch (uploadError) {
      console.error('Upload Error:', uploadError);
      res.status(500).json({ error: 'Failed to process file upload. Please try again.' });
    }
  });
});

// POST /api/admin/upload/gallery — multiple media uploads (max 12)
router.post('/gallery', requireAuth, (req, res) => {
  upload.array('images', 12)(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'One or more files exceed the 25MB limit' });
      }
      return res.status(400).json({ error: err.message });
    }
    if (err) return res.status(400).json({ error: err.message });
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    try {
      let urls = [];
      if (isS3Configured) {
        urls = await Promise.all(req.files.map((file) => uploadToS3(file)));
      } else {
        urls = req.files.map((f) => `/uploads/${f.filename}`);
      }

      res.status(201).json({ urls });
    } catch (uploadError) {
      console.error('Gallery Upload Error:', uploadError);
      res.status(500).json({ error: 'Failed to process gallery upload' });
    }
  });
});

module.exports = router;
