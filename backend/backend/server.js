require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const path = require('path');

// Ensures the DB file + schema exist before any route touches it
require('./db');
try {
  require('./db/seed');
} catch (e) {
  console.log('Seed skipped or already completed:', e.message);
}

const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const teamRoutes = require('./routes/team');
const contactRoutes = require('./routes/contact');
const joinRoutes = require('./routes/join');
const contentRoutes = require('./routes/content');
const uploadRoutes = require('./routes/upload');

const app = express();
const PORT = process.env.PORT || 4000;

// Trust reverse proxy (Cloudflare / Render / Nginx) so client IP and HTTPS are detected accurately
app.set('trust proxy', 1);

const fs = require('fs');

const allowedOrigins = process.env.FRONTEND_ORIGIN
  ? process.env.FRONTEND_ORIGIN.split(',').map((s) => s.trim())
  : [];

/* ---------- global middleware ---------- */
app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (like mobile apps, curl, or same-origin static)
      // or any localhost / 127.0.0.1 origins on any port
      if (!origin || /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
        return callback(null, true);
      }
      if (allowedOrigins.length > 0 && (allowedOrigins.includes(origin) || allowedOrigins.includes('*'))) {
        return callback(null, true);
      }
      callback(null, origin);
    },
    credentials: true, // required so the httpOnly session cookie is sent/received
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

// Health check endpoint for Render zero-downtime deployments & uptime monitoring
app.get('/healthz', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Basic global rate limit as a backstop; stricter limits also applied per-route (login, forms)
app.use(
  '/api/',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// Ensure uploads folder exists and serve uploaded media
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Serve static frontend files so http://localhost:4000/ serves the web app directly
const frontendDir = path.join(__dirname, '..', '..', 'frontend');
if (fs.existsSync(frontendDir)) {
  app.use(express.static(frontendDir));
}

/* ---------- routes ---------- */
// Public + admin-protected routes are combined per resource; each router internally
// guards its own /admin/* and mutation endpoints with requireAuth.
app.use('/api/admin', authRoutes);          // login, logout, me, change-password
app.use('/api/projects', projectRoutes);    // public GET + admin CUD (mounted at /api/projects, admin sub-routes below)
app.use('/api/admin/projects', projectRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/admin/team', teamRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin/contact-messages', contactRoutes);
app.use('/api/join', joinRoutes);
app.use('/api/admin/join-requests', joinRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/admin/content', contentRoutes);
app.use('/api/admin/upload', uploadRoutes);

// GET /api/admin/dashboard-stats — overview numbers for the admin dashboard
const { db } = require('./db');
const { requireAuth } = require('./middleware/auth');
app.get('/api/admin/dashboard-stats', requireAuth, (req, res) => {
  const count = (sql, ...params) => db.prepare(sql).get(...params).c;
  res.json({
    totalProjects: count('SELECT COUNT(*) AS c FROM projects'),
    completedProjects: count("SELECT COUNT(*) AS c FROM projects WHERE category = 'completed'"),
    ongoingProjects: count("SELECT COUNT(*) AS c FROM projects WHERE category = 'ongoing'"),
    upcomingProjects: count("SELECT COUNT(*) AS c FROM projects WHERE category = 'upcoming'"),
    totalTeamMembers: count('SELECT COUNT(*) AS c FROM team_members'),
    newContactMessages: count("SELECT COUNT(*) AS c FROM contact_messages WHERE status = 'new'"),
    newJoinRequests: count("SELECT COUNT(*) AS c FROM join_requests WHERE status = 'new'"),
  });
});

/* ---------- error handling ---------- */
// Catch-all for unmatched API routes
app.use('/api', (req, res) => res.status(404).json({ error: 'Endpoint not found' }));

// Never leak stack traces or internal errors to the client
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong. Please try again.' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Sivakasi Green Forum API running on port ${PORT}`);
});

module.exports = app;
