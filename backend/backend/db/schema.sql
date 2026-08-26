-- Sivakasi Green Forum — Database Schema
-- SQLite (swap-compatible with Postgres/MySQL with minor type changes)

CREATE TABLE IF NOT EXISTS admins (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  name          TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'admin',   -- admin | super_admin
  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS team_members (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  name           TEXT NOT NULL,
  designation    TEXT NOT NULL,
  department     TEXT,
  biography      TEXT,
  image_url      TEXT,
  social_links   TEXT,                 -- JSON string: {"linkedin":"...","email":"..."}
  display_order  INTEGER DEFAULT 0,
  is_published   INTEGER DEFAULT 1,    -- 0/1 boolean
  created_at     DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS projects (
  id                        INTEGER PRIMARY KEY AUTOINCREMENT,
  title                     TEXT NOT NULL,
  slug                      TEXT NOT NULL UNIQUE,
  category                  TEXT NOT NULL CHECK(category IN ('completed','ongoing','upcoming')),
  project_category_tag      TEXT,       -- e.g. "Water Restoration", "Afforestation"
  short_description         TEXT,
  description               TEXT,
  cover_image                TEXT,
  gallery                   TEXT,       -- JSON array of image URLs
  videos                    TEXT,       -- JSON array of video URLs
  location                  TEXT,
  start_date                TEXT,
  end_date                  TEXT,
  expected_completion_date  TEXT,
  objectives                TEXT,       -- JSON array of strings
  impact                    TEXT,
  progress                  INTEGER DEFAULT 0,   -- 0-100, used for ongoing
  status                    TEXT DEFAULT 'draft', -- draft | published
  display_order             INTEGER DEFAULT 0,
  created_at                DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at                DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  phone       TEXT,
  subject     TEXT,
  message     TEXT NOT NULL,
  status      TEXT DEFAULT 'new',   -- new | read | replied
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS join_requests (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  phone       TEXT,
  location    TEXT,
  interest    TEXT,   -- Volunteer | Membership | Donate | Partnership | Internship | General Inquiry
  message     TEXT,
  status      TEXT DEFAULT 'new',   -- new | reviewed | contacted
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Single-row-per-key site content store (About, Mission, Vision, Contact, Join Us intro, etc.)
CREATE TABLE IF NOT EXISTS site_content (
  content_key TEXT PRIMARY KEY,   -- 'about', 'mission_vision', 'contact', 'join_us'
  content_json TEXT NOT NULL,     -- JSON blob for that section
  updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category, status);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_team_published ON team_members(is_published, display_order);
CREATE INDEX IF NOT EXISTS idx_contact_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_join_status ON join_requests(status);
