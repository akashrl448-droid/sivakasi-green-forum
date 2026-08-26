const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const { db } = require('../db');
const { requireAuth, JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

// Throttle login attempts to slow brute-force attacks
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts. Please try again later.' },
});

const cookieOpts = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // requires HTTPS in production
  sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
  maxAge: 8 * 60 * 60 * 1000, // 8 hours
};

// POST /api/admin/login
router.post(
  '/login',
  loginLimiter,
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isString().isLength({ min: 1 }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Valid email and password are required' });
    }

    const { email, password } = req.body;
    const admin = db.prepare('SELECT * FROM admins WHERE email = ?').get(email);

    // Same generic error whether the email doesn't exist or the password is wrong —
    // avoids leaking which emails are registered admins.
    if (!admin || !bcrypt.compareSync(password, admin.password_hash)) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.cookie('sgf_session', token, cookieOpts);
    res.json({ id: admin.id, name: admin.name, email: admin.email, role: admin.role, token });
  }
);

// POST /api/admin/logout
router.post('/logout', (req, res) => {
  res.clearCookie('sgf_session', { httpOnly: true, sameSite: 'strict' });
  res.json({ success: true });
});

// GET /api/admin/me
router.get('/me', requireAuth, (req, res) => {
  const admin = db.prepare('SELECT id, name, email, role, created_at FROM admins WHERE id = ?').get(req.admin.id);
  if (!admin) return res.status(404).json({ error: 'Admin not found' });
  res.json(admin);
});

// PUT /api/admin/change-password
router.put(
  '/change-password',
  requireAuth,
  [
    body('currentPassword').isString().notEmpty(),
    body('newPassword').isString().isLength({ min: 8 }).withMessage('New password must be at least 8 characters'),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const admin = db.prepare('SELECT * FROM admins WHERE id = ?').get(req.admin.id);
    if (!bcrypt.compareSync(req.body.currentPassword, admin.password_hash)) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    const newHash = bcrypt.hashSync(req.body.newPassword, 10);
    db.prepare('UPDATE admins SET password_hash = ? WHERE id = ?').run(newHash, req.admin.id);
    res.json({ success: true });
  }
);

module.exports = router;
