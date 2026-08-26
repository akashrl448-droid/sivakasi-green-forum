const express = require('express');
const { body, param, query, validationResult } = require('express-validator');
const { db } = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

function slugify(title) {
  return title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function parseProjectRow(row) {
  return {
    ...row,
    gallery: row.gallery ? JSON.parse(row.gallery) : [],
    videos: row.videos ? JSON.parse(row.videos) : [],
    objectives: row.objectives ? JSON.parse(row.objectives) : [],
    is_published: row.status === 'published',
  };
}

/* ---------- PUBLIC ---------- */

// GET /api/projects?category=completed&page=1&limit=9
// Public listing — only published projects, dynamically filtered by category (section 29 of spec)
router.get('/', [query('category').optional().isIn(['completed', 'ongoing', 'upcoming'])], (req, res) => {
  const { category } = req.query;
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(50, parseInt(req.query.limit) || 9);
  const offset = (page - 1) * limit;

  let where = "WHERE status = 'published'";
  const params = [];
  if (category) {
    where += ' AND category = ?';
    params.push(category);
  }

  const total = db.prepare(`SELECT COUNT(*) AS c FROM projects ${where}`).get(...params).c;
  const rows = db
    .prepare(`SELECT * FROM projects ${where} ORDER BY display_order ASC, created_at DESC LIMIT ? OFFSET ?`)
    .all(...params, limit, offset);

  res.json({
    projects: rows.map(parseProjectRow),
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
});

/* ---------- ADMIN ALL PROJECTS (must be defined before /:slug) ---------- */
const getAllAdminProjects = (req, res) => {
  const rows = db.prepare('SELECT * FROM projects ORDER BY display_order ASC, created_at DESC').all();
  res.json({ projects: rows.map(parseProjectRow) });
};
router.get('/admin/all', requireAuth, getAllAdminProjects);
router.get('/all', requireAuth, getAllAdminProjects);

// GET /api/projects/:slug — public project detail (only if published)
router.get('/:slug', (req, res, next) => {
  if (req.params.slug === 'all' || req.params.slug === 'admin') {
    return next();
  }
  const row = db.prepare("SELECT * FROM projects WHERE slug = ? AND status = 'published'").get(req.params.slug);
  if (!row) return res.status(404).json({ error: 'Project not found' });

  const related = db
    .prepare(
      `SELECT id, title, slug, category, cover_image FROM projects
       WHERE status = 'published' AND id != ? ORDER BY RANDOM() LIMIT 3`
    )
    .all(row.id);

  res.json({ project: parseProjectRow(row), related });
});

function normalizeArray(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {
      return val.split('\n').map(s => s.trim()).filter(Boolean);
    }
  }
  return [];
}

const projectValidation = [
  body('title').isString().trim().isLength({ min: 2 }).withMessage('Title is required'),
  body('category').isIn(['completed', 'ongoing', 'upcoming']).withMessage('Category must be completed, ongoing, or upcoming'),
  body('progress').optional().isInt({ min: 0, max: 100 }).withMessage('Progress must be 0-100'),
  body('status').optional().isIn(['draft', 'published']),
];

// POST /api/admin/projects — create
router.post('/', requireAuth, projectValidation, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg });

  const b = req.body;
  let slug = b.slug ? slugify(b.slug) : slugify(b.title);
  const exists = db.prepare('SELECT id FROM projects WHERE slug = ?').get(slug);
  if (exists) slug = `${slug}-${Date.now().toString(36)}`;

  const galleryList = normalizeArray(b.gallery);
  const videosList = normalizeArray(b.videos);
  const objectivesList = normalizeArray(b.objectives);

  const result = db
    .prepare(
      `INSERT INTO projects
        (title, slug, category, project_category_tag, short_description, description, cover_image, gallery, videos,
         location, start_date, end_date, expected_completion_date, objectives, impact, progress, status, display_order)
       VALUES (@title, @slug, @category, @tag, @short, @description, @cover, @gallery, @videos,
         @location, @start, @end, @expected, @objectives, @impact, @progress, @status, @order)`
    )
    .run({
      title: b.title,
      slug,
      category: b.category,
      tag: b.projectCategoryTag || null,
      short: b.shortDescription || null,
      description: b.description || null,
      cover: b.coverImage || null,
      gallery: JSON.stringify(galleryList),
      videos: JSON.stringify(videosList),
      location: b.location || null,
      start: b.startDate || null,
      end: b.endDate || null,
      expected: b.expectedCompletionDate || null,
      objectives: JSON.stringify(objectivesList),
      impact: b.impact || null,
      progress: b.progress ?? 0,
      status: b.status || 'draft',
      order: b.displayOrder ?? 0,
    });

  const created = db.prepare('SELECT * FROM projects WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({ project: parseProjectRow(created) });
});

// PUT /api/admin/projects/:id — update (including moving between categories, per section 16)
router.put('/:id', requireAuth, [param('id').isInt()], projectValidation, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg });

  const existing = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Project not found' });

  const b = req.body;
  const galleryList = b.gallery !== undefined ? normalizeArray(b.gallery) : (existing.gallery ? JSON.parse(existing.gallery) : []);
  const videosList = b.videos !== undefined ? normalizeArray(b.videos) : (existing.videos ? JSON.parse(existing.videos) : []);
  const objectivesList = b.objectives !== undefined ? normalizeArray(b.objectives) : (existing.objectives ? JSON.parse(existing.objectives) : []);

  db.prepare(
    `UPDATE projects SET
      title=@title, category=@category, project_category_tag=@tag, short_description=@short, description=@description,
      cover_image=@cover, gallery=@gallery, videos=@videos, location=@location, start_date=@start, end_date=@end,
      expected_completion_date=@expected, objectives=@objectives, impact=@impact, progress=@progress,
      status=@status, display_order=@order, updated_at=CURRENT_TIMESTAMP
     WHERE id=@id`
  ).run({
    id: req.params.id,
    title: b.title,
    category: b.category,
    tag: b.projectCategoryTag !== undefined ? (b.projectCategoryTag || null) : existing.project_category_tag,
    short: b.shortDescription !== undefined ? (b.shortDescription || null) : existing.short_description,
    description: b.description !== undefined ? (b.description || null) : existing.description,
    cover: b.coverImage !== undefined ? (b.coverImage || null) : existing.cover_image,
    gallery: JSON.stringify(galleryList),
    videos: JSON.stringify(videosList),
    location: b.location !== undefined ? (b.location || null) : existing.location,
    start: b.startDate !== undefined ? (b.startDate || null) : existing.start_date,
    end: b.endDate !== undefined ? (b.endDate || null) : existing.end_date,
    expected: b.expectedCompletionDate !== undefined ? (b.expectedCompletionDate || null) : existing.expected_completion_date,
    objectives: JSON.stringify(objectivesList),
    impact: b.impact !== undefined ? (b.impact || null) : existing.impact,
    progress: b.progress ?? existing.progress,
    status: b.status || existing.status,
    order: b.displayOrder ?? existing.display_order,
  });

  const updated = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
  res.json({ project: parseProjectRow(updated) });
});

// PATCH /api/admin/projects/:id/publish — quick publish/unpublish toggle
router.patch('/:id/publish', requireAuth, (req, res) => {
  const existing = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Project not found' });
  const newStatus = existing.status === 'published' ? 'draft' : 'published';
  db.prepare('UPDATE projects SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(newStatus, req.params.id);
  res.json({ id: Number(req.params.id), status: newStatus });
});

// DELETE /api/admin/projects/:id
router.delete('/:id', requireAuth, (req, res) => {
  const result = db.prepare('DELETE FROM projects WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Project not found' });
  res.json({ success: true });
});

module.exports = router;
