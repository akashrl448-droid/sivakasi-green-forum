const express = require('express');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const { db } = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// Prevent form-spam floods from a single client
const formLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many submissions. Please try again later.' },
});

// POST /api/contact — public
router.post(
  '/',
  formLimiter,
  [
    body('name').isString().trim().isLength({ min: 2 }).withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('A valid email is required'),
    body('message').isString().trim().isLength({ min: 5 }).withMessage('Message is required'),
    body('phone').optional({ checkFalsy: true }).isString().trim(),
    body('subject').optional({ checkFalsy: true }).isString().trim(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { name, email, phone, subject, message } = req.body;
    db.prepare(
      `INSERT INTO contact_messages (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)`
    ).run(name, email, phone || null, subject || null, message);

    res.status(201).json({ success: true, message: "Thanks for reaching out — we'll get back to you within 2 working days." });
  }
);

// GET /api/admin/contact-messages/all or /api/admin/contact-messages/admin/all
const getAllContactMessages = (req, res) => {
  const { status } = req.query;
  let sql = 'SELECT * FROM contact_messages';
  const params = [];
  if (status) {
    sql += ' WHERE status = ?';
    params.push(status);
  }
  sql += ' ORDER BY created_at DESC';
  const rows = db.prepare(sql).all(...params);
  res.json({ messages: rows });
};
router.get('/admin/all', requireAuth, getAllContactMessages);
router.get('/all', requireAuth, getAllContactMessages);
router.get('/', requireAuth, getAllContactMessages);

// PATCH /api/admin/contact-messages/:id — update status (new/read/replied)
router.patch('/:id', requireAuth, [body('status').isIn(['new', 'read', 'replied'])], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ error: 'Invalid status' });
  const result = db.prepare('UPDATE contact_messages SET status = ? WHERE id = ?').run(req.body.status, req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Message not found' });
  res.json({ success: true });
});

// DELETE /api/admin/contact-messages/:id
router.delete('/:id', requireAuth, (req, res) => {
  const result = db.prepare('DELETE FROM contact_messages WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Message not found' });
  res.json({ success: true });
});

module.exports = router;
