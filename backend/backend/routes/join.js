const express = require('express');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const { db } = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

const formLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many submissions. Please try again later.' },
});

const VALID_INTERESTS = ['Volunteer', 'Membership', 'Donate', 'Partnership', 'Internship', 'General Inquiry'];

// POST /api/join — public
router.post(
  '/',
  formLimiter,
  [
    body('name').isString().trim().isLength({ min: 2 }).withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('A valid email is required'),
    body('phone').isString().trim().isLength({ min: 6 }).withMessage('Phone number is required'),
    body('interest').isIn(VALID_INTERESTS).withMessage('Please select a valid interest'),
    body('location').optional({ checkFalsy: true }).isString().trim(),
    body('message').optional({ checkFalsy: true }).isString().trim(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { name, email, phone, location, interest, message } = req.body;
    db.prepare(
      `INSERT INTO join_requests (name, email, phone, location, interest, message) VALUES (?, ?, ?, ?, ?, ?)`
    ).run(name, email, phone, location || null, interest, message || null);

    res.status(201).json({ success: true, message: 'Your submission has been received. Our team will follow up within 3 working days.' });
  }
);

// GET /api/admin/join-requests/all or /api/admin/join-requests/admin/all
const getAllJoinRequests = (req, res) => {
  const { status, interest } = req.query;
  let sql = 'SELECT * FROM join_requests WHERE 1=1';
  const params = [];
  if (status) { sql += ' AND status = ?'; params.push(status); }
  if (interest) { sql += ' AND interest = ?'; params.push(interest); }
  sql += ' ORDER BY created_at DESC';
  const rows = db.prepare(sql).all(...params);
  res.json({ requests: rows });
};
router.get('/admin/all', requireAuth, getAllJoinRequests);
router.get('/all', requireAuth, getAllJoinRequests);
router.get('/', requireAuth, getAllJoinRequests);

// PATCH /api/admin/join-requests/:id — update status
router.patch('/:id', requireAuth, [body('status').isIn(['new', 'reviewed', 'contacted'])], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ error: 'Invalid status' });
  const result = db.prepare('UPDATE join_requests SET status = ? WHERE id = ?').run(req.body.status, req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Request not found' });
  res.json({ success: true });
});

// DELETE /api/admin/join-requests/:id
router.delete('/:id', requireAuth, (req, res) => {
  const result = db.prepare('DELETE FROM join_requests WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Request not found' });
  res.json({ success: true });
});

module.exports = router;
