const express = require('express');
const { body, param, validationResult } = require('express-validator');
const { db } = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
const VALID_KEYS = ['about', 'mission_vision', 'contact', 'join_us'];

// GET /api/content — public, returns all editable site content in one payload
router.get('/', (req, res) => {
  const rows = db.prepare('SELECT content_key, content_json, updated_at FROM site_content').all();
  const content = {};
  rows.forEach(r => { content[r.content_key] = JSON.parse(r.content_json); });
  res.json({ content });
});

// GET /api/content/:key — public, single section (e.g. /api/content/about)
router.get('/:key', [param('key').isIn(VALID_KEYS)], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ error: 'Unknown content section' });

  const row = db.prepare('SELECT content_json, updated_at FROM site_content WHERE content_key = ?').get(req.params.key);
  if (!row) return res.status(404).json({ error: 'Content not found' });
  res.json({ key: req.params.key, content: JSON.parse(row.content_json), updated_at: row.updated_at });
});

// PUT /api/admin/content/:key — admin edit (About / Mission & Vision / Contact / Join Us)
router.put(
  '/:key',
  requireAuth,
  [param('key').isIn(VALID_KEYS), body().isObject().withMessage('Request body must be a JSON object')],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg });

    const exists = db.prepare('SELECT content_key FROM site_content WHERE content_key = ?').get(req.params.key);
    const json = JSON.stringify(req.body);

    if (exists) {
      db.prepare('UPDATE site_content SET content_json = ?, updated_at = CURRENT_TIMESTAMP WHERE content_key = ?').run(json, req.params.key);
    } else {
      db.prepare('INSERT INTO site_content (content_key, content_json) VALUES (?, ?)').run(req.params.key, json);
    }

    res.json({ key: req.params.key, content: req.body });
  }
);

module.exports = router;
