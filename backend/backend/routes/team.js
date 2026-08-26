const express = require('express');
const { body, validationResult } = require('express-validator');
const { db } = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

function parseTeamRow(row) {
  return {
    ...row,
    social_links: row.social_links ? JSON.parse(row.social_links) : {},
    is_published: !!row.is_published,
  };
}

// GET /api/team — public, only published members, ordered for display
router.get('/', (req, res) => {
  const rows = db
    .prepare('SELECT * FROM team_members WHERE is_published = 1 ORDER BY display_order ASC, id ASC')
    .all();
  res.json({ team: rows.map(parseTeamRow) });
});

// GET /api/admin/team/all or /api/admin/team/admin/all — all members regardless of published state
const getAllTeam = (req, res) => {
  const rows = db.prepare('SELECT * FROM team_members ORDER BY display_order ASC, id ASC').all();
  res.json({ team: rows.map(parseTeamRow) });
};
router.get('/admin/all', requireAuth, getAllTeam);
router.get('/all', requireAuth, getAllTeam);

const memberValidation = [
  body('name').isString().trim().isLength({ min: 2 }).withMessage('Name is required'),
  body('designation').isString().trim().isLength({ min: 2 }).withMessage('Designation is required'),
];

// POST /api/admin/team — create
router.post('/', requireAuth, memberValidation, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg });

  const b = req.body;
  const result = db
    .prepare(
      `INSERT INTO team_members (name, designation, department, biography, image_url, social_links, display_order, is_published)
       VALUES (@name, @designation, @department, @bio, @image, @social, @order, @published)`
    )
    .run({
      name: b.name,
      designation: b.designation,
      department: b.department || null,
      bio: b.biography || null,
      image: b.imageUrl || null,
      social: JSON.stringify(b.socialLinks || {}),
      order: b.displayOrder ?? 0,
      published: b.isPublished === false ? 0 : 1,
    });

  const created = db.prepare('SELECT * FROM team_members WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({ member: parseTeamRow(created) });
});

// PUT /api/admin/team/:id — update
router.put('/:id', requireAuth, memberValidation, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg });

  const existing = db.prepare('SELECT * FROM team_members WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Team member not found' });

  const b = req.body;
  db.prepare(
    `UPDATE team_members SET
      name=@name, designation=@designation, department=@department, biography=@bio, image_url=@image,
      social_links=@social, display_order=@order, is_published=@published, updated_at=CURRENT_TIMESTAMP
     WHERE id=@id`
  ).run({
    id: req.params.id,
    name: b.name,
    designation: b.designation,
    department: b.department || null,
    bio: b.biography || null,
    image: b.imageUrl || existing.image_url,
    social: JSON.stringify(b.socialLinks || {}),
    order: b.displayOrder ?? existing.display_order,
    published: b.isPublished === undefined ? existing.is_published : (b.isPublished ? 1 : 0),
  });

  const updated = db.prepare('SELECT * FROM team_members WHERE id = ?').get(req.params.id);
  res.json({ member: parseTeamRow(updated) });
});

// PATCH /api/admin/team/:id/publish — activate/deactivate toggle
router.patch('/:id/publish', requireAuth, (req, res) => {
  const existing = db.prepare('SELECT * FROM team_members WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Team member not found' });
  const newVal = existing.is_published ? 0 : 1;
  db.prepare('UPDATE team_members SET is_published = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(newVal, req.params.id);
  res.json({ id: Number(req.params.id), is_published: !!newVal });
});

// DELETE /api/admin/team/:id
router.delete('/:id', requireAuth, (req, res) => {
  const result = db.prepare('DELETE FROM team_members WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Team member not found' });
  res.json({ success: true });
});

module.exports = router;
