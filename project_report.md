# 📋 Project Report — Sivakasi Green Forum (SGF)

## 1. Overview

**Sivakasi Green Forum (SGF)** is a full-stack web application built for an environmental non-profit organization based in Sivakasi, Tamil Nadu, India. The platform serves as the organization's public-facing website and includes a complete admin panel for managing all content.

The project is a **monolithic Node.js web app** — the backend serves both the REST API and the static HTML frontend from a single Express server.

---

## 2. Technology Stack

| Layer | Technology | Details |
|---|---|---|
| **Runtime** | Node.js | v20+ (Express 5) |
| **Backend Framework** | Express.js v5 | REST API |
| **Database** | SQLite (better-sqlite3) | File-based, WAL mode enabled |
| **Authentication** | JWT + bcryptjs | httpOnly cookie sessions |
| **File Uploads** | Multer | Local disk storage |
| **Input Validation** | express-validator | Per-route validation |
| **Rate Limiting** | express-rate-limit | Global + per-form |
| **Frontend** | Vanilla HTML + CSS + JS | 12 static HTML pages |
| **Dev Tools** | dotenv, cookie-parser, cors | Standard middleware |

---

## 3. Project Structure

```
green/
├── frontend/                    ← 12 static HTML pages
│   ├── index.html               ← Home page
│   ├── about.html
│   ├── mission-vision.html
│   ├── team.html
│   ├── contact.html
│   ├── join-us.html
│   ├── project-detail.html
│   ├── projects-completed.html
│   ├── projects-ongoing.html
│   ├── projects-upcoming.html
│   ├── admin-login.html         ← Admin login page
│   └── admin-dashboard.html     ← Full admin panel (88KB!)
│
└── backend/backend/
    ├── server.js                ← App entry point
    ├── .env                     ← Secrets (JWT, PORT)
    ├── db/
    │   ├── index.js             ← DB connection & schema init
    │   ├── schema.sql           ← 6 tables defined
    │   ├── seed.js              ← Dev data seeder
    │   ├── add_projects.js      ← Bulk project importer
    │   └── sgf.db               ← Live SQLite database file
    ├── middleware/
    │   └── auth.js              ← JWT guard (requireAuth, requireRole)
    ├── routes/
    │   ├── auth.js              ← Login, logout, me, change-password
    │   ├── projects.js          ← CRUD for projects
    │   ├── team.js              ← CRUD for team members
    │   ├── contact.js           ← Contact form & inbox
    │   ├── join.js              ← Join/volunteer form & requests
    │   ├── content.js           ← Editable site content blocks
    │   └── upload.js            ← Image upload (single + gallery)
    └── uploads/                 ← Uploaded images stored here
```

---

## 4. Database Schema

### 6 Tables

#### `admins`
| Column | Type | Notes |
|---|---|---|
| id | INTEGER PK | Auto-increment |
| name | TEXT | Admin's display name |
| email | TEXT UNIQUE | Login identifier |
| password_hash | TEXT | bcrypt hashed |
| role | TEXT | `admin` \| `super_admin` |
| created_at | DATETIME | Auto |

#### `projects`
| Column | Type | Notes |
|---|---|---|
| id | INTEGER PK | — |
| title | TEXT | Required |
| slug | TEXT UNIQUE | Auto-generated from title |
| category | TEXT | `completed` \| `ongoing` \| `upcoming` |
| project_category_tag | TEXT | e.g. "Afforestation" |
| short_description | TEXT | — |
| description | TEXT | Full HTML/text |
| cover_image | TEXT | URL |
| gallery | TEXT | JSON array of image URLs |
| videos | TEXT | JSON array of video URLs |
| location | TEXT | — |
| start_date / end_date | TEXT | — |
| expected_completion_date | TEXT | For upcoming |
| objectives | TEXT | JSON array of strings |
| impact | TEXT | — |
| progress | INTEGER | 0–100 (for ongoing) |
| status | TEXT | `draft` \| `published` |
| display_order | INTEGER | Manual ordering |

#### `team_members`
Stores name, designation, department, biography, image URL, social links (JSON), display order, and publish state.

#### `contact_messages`
Stores public contact form submissions: name, email, phone, subject, message, status (`new` → `read` → `replied`).

#### `join_requests`
Stores join/volunteer applications: name, email, phone, location, interest type, message, status (`new` → `reviewed` → `contacted`).

#### `site_content`
A key-value store for editable page content (About, Mission/Vision, Contact page intro, Join Us intro) — stored as JSON blobs.

### Indexes
- `idx_projects_category` — fast filtering by category + status
- `idx_projects_slug` — fast slug lookups
- `idx_team_published` — fast published team queries
- `idx_contact_status` / `idx_join_status` — fast status filtering

---

## 5. API Endpoints

### 🔓 Public APIs
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/projects` | List published projects (paginated, filter by category) |
| `GET` | `/api/projects/:slug` | Single project detail + 3 related projects |
| `GET` | `/api/team` | List all published team members |
| `POST` | `/api/contact` | Submit contact form |
| `POST` | `/api/join` | Submit join/volunteer request |
| `GET` | `/api/content/:key` | Get editable site content block |

### 🔒 Admin APIs (JWT required)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/admin/login` | Login (sets httpOnly cookie) |
| `POST` | `/api/admin/logout` | Clear session cookie |
| `GET` | `/api/admin/me` | Current admin info |
| `PUT` | `/api/admin/change-password` | Update password |
| `GET` | `/api/admin/dashboard-stats` | Summary counts for dashboard |
| `GET/POST/PUT/DELETE` | `/api/admin/projects/*` | Full project CRUD |
| `PATCH` | `/api/admin/projects/:id/publish` | Toggle publish/draft |
| `GET/POST/PUT/DELETE` | `/api/admin/team/*` | Full team CRUD |
| `PATCH` | `/api/admin/team/:id/publish` | Toggle member visibility |
| `GET/PATCH/DELETE` | `/api/admin/contact-messages/*` | Manage contact inbox |
| `GET/PATCH/DELETE` | `/api/admin/join-requests/*` | Manage join applications |
| `GET/PUT` | `/api/admin/content/*` | Edit site content blocks |
| `POST` | `/api/admin/upload` | Upload single image |
| `POST` | `/api/admin/upload/gallery` | Upload up to 12 images |

---

## 6. Frontend Pages

| Page | File | Purpose |
|---|---|---|
| Home | `index.html` | Landing page |
| About | `about.html` | Organization background |
| Mission & Vision | `mission-vision.html` | Goals and values |
| Team | `team.html` | Member profiles |
| Contact | `contact.html` | Contact form |
| Join Us | `join-us.html` | Volunteer/membership form |
| Projects (Completed) | `projects-completed.html` | Completed project listing |
| Projects (Ongoing) | `projects-ongoing.html` | Ongoing project listing |
| Projects (Upcoming) | `projects-upcoming.html` | Upcoming project listing |
| Project Detail | `project-detail.html` | Single project detail view |
| Admin Login | `admin-login.html` | Admin authentication page |
| Admin Dashboard | `admin-dashboard.html` | Full CMS panel (88KB) |

---

## 7. Security Implementation

| Feature | Implementation |
|---|---|
| **Password Hashing** | bcryptjs (cost factor 10) |
| **Authentication** | JWT tokens (8hr expiry) in httpOnly cookies |
| **CSRF Protection** | SameSite=Strict cookie in production |
| **Brute-force Protection** | 10 login attempts / 15 min |
| **Form Spam Protection** | 8 submissions / hour on join & contact forms |
| **Global Rate Limit** | 1000 API requests / 15 min |
| **Input Validation** | express-validator on all mutation endpoints |
| **Error Hiding** | Generic 500 errors — no stack traces leaked |
| **Roles** | `admin` and `super_admin` support |

---

## 8. Key Design Decisions

1. **SQLite over Postgres/MySQL** — Simplified deployment (no DB server), WAL mode for concurrency, schema is swap-compatible with Postgres per comments.
2. **Unified Server** — The Express server serves both the API (`/api/*`) and static HTML frontend, eliminating the need for a separate web server.
3. **JSON fields in SQLite** — Arrays (gallery, objectives, videos, social_links) stored as JSON strings in TEXT columns — parsed on every API read.
4. **Draft/Published workflow** — Projects and team members support draft state, keeping unpublished content hidden from public APIs.
5. **Slug-based routing** — Projects use URL-friendly slugs for public detail pages.

---

## 9. Identified Gaps / Potential Issues

> [!WARNING]
> **Ephemeral Uploads** — Images uploaded via Multer are stored in the local `uploads/` folder. On any cloud platform with ephemeral storage (Render free tier), these will be lost on redeploy.

> [!WARNING]
> **No Email Notifications** — No email is sent when a contact message or join request is submitted. Admin must check the dashboard manually.

> [!NOTE]
> **No Frontend Build System** — The frontend is plain HTML/CSS/JS with no bundler. This is simple to deploy but harder to scale or modularize.

> [!NOTE]
> **Single SQLite file** — Fine for low-to-medium traffic. For high concurrency, consider migrating to PostgreSQL.

---

## 10. Summary

**Sivakasi Green Forum** is a well-structured, production-ready website for a non-profit. It has:
- ✅ A clean public site with projects, team, and contact pages
- ✅ A full CMS admin panel with role-based access
- ✅ Solid security practices (JWT, bcrypt, rate limiting)
- ✅ Image upload support
- ✅ Draft/publish workflow for content
- ⚠️ No email notifications system
- ⚠️ No cloud storage for uploaded images
- ⚠️ Single-file SQLite (fine for low traffic, needs migration for scale)
