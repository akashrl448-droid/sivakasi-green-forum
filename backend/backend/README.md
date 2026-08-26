# Sivakasi Green Forum — Backend API

Node.js + Express + SQLite backend powering the Sivakasi Green Forum website
(front-end pages: `index.html`, `about.html`, `team.html`, `mission-vision.html`,
`projects-*.html`, `project-detail.html`, `join-us.html`, `contact.html`,
`admin-login.html`, `admin-dashboard.html`).

## Setup

```bash
npm install
cp .env.example .env      # then edit JWT_SECRET before deploying anywhere real
node db/seed.js           # creates sgf.db and seeds it with starter content
node server.js            # starts the API on http://localhost:4000
```

Default admin login (created by the seed script):
- **Email:** `admin@sivakasigreenforum.org`
- **Password:** `ChangeMe123!`

⚠️ Change this password immediately via `PUT /api/admin/change-password` after first login —
it's a placeholder for local development only.

## Architecture

- **Database:** SQLite via `better-sqlite3` (swap for Postgres/MySQL in production by
  changing `db/index.js` and adjusting a handful of SQLite-specific syntax bits in schema.sql —
  the query layer is plain SQL, no ORM lock-in).
- **Auth:** email/password with bcrypt hashing, JWT stored in an httpOnly, sameSite=strict
  cookie (not localStorage — avoids XSS token theft). Session expires after 8 hours.
- **File uploads:** `multer`, validated by MIME type and capped at 5MB, written to `/uploads`
  and served statically. Swap the storage engine for S3/Cloud Storage in production.
- **Rate limiting:** global backstop on `/api/*`, plus stricter limits on `/api/admin/login`
  and the public `contact`/`join` form endpoints to blunt spam and brute-force attempts.
- **Validation:** `express-validator` on every write endpoint — no unvalidated input reaches
  the database.

## Environment variables

See `.env.example`. At minimum, set a strong `JWT_SECRET` before deploying anywhere
besides your own machine.

## API Reference

### Auth
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/admin/login` | — | Email + password login, sets session cookie |
| POST | `/api/admin/logout` | — | Clears session cookie |
| GET | `/api/admin/me` | ✅ | Current admin's profile |
| PUT | `/api/admin/change-password` | ✅ | Change password |

### Projects
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/projects?category=&page=&limit=` | — | Published projects, filterable by category |
| GET | `/api/projects/:slug` | — | Single published project + 3 related |
| GET | `/api/admin/projects/admin/all` | ✅ | All projects (any status) |
| POST | `/api/admin/projects` | ✅ | Create project |
| PUT | `/api/admin/projects/:id` | ✅ | Update project (including changing category) |
| PATCH | `/api/admin/projects/:id/publish` | ✅ | Toggle published/draft |
| DELETE | `/api/admin/projects/:id` | ✅ | Delete project |

### Team
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/team` | — | Published team members, ordered |
| GET | `/api/admin/team/admin/all` | ✅ | All members (any status) |
| POST | `/api/admin/team` | ✅ | Create member |
| PUT | `/api/admin/team/:id` | ✅ | Update member |
| PATCH | `/api/admin/team/:id/publish` | ✅ | Toggle activate/deactivate |
| DELETE | `/api/admin/team/:id` | ✅ | Delete member |

### Contact & Join
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/contact` | — | Submit contact form (rate limited) |
| GET | `/api/admin/contact-messages/admin/all?status=` | ✅ | List messages |
| PATCH | `/api/admin/contact-messages/:id` | ✅ | Update status |
| DELETE | `/api/admin/contact-messages/:id` | ✅ | Delete message |
| POST | `/api/join` | — | Submit join request (rate limited) |
| GET | `/api/admin/join-requests/admin/all?status=&interest=` | ✅ | List requests |
| PATCH | `/api/admin/join-requests/:id` | ✅ | Update status |
| DELETE | `/api/admin/join-requests/:id` | ✅ | Delete request |

### Site Content
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/content` | — | All editable content (about, mission_vision, contact, join_us) |
| GET | `/api/content/:key` | — | Single content section |
| PUT | `/api/admin/content/:key` | ✅ | Update a content section |

### Media
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/admin/upload` | ✅ | Single image upload (form field: `image`) |
| POST | `/api/admin/upload/gallery` | ✅ | Multiple images (form field: `images`, max 12) |

### Dashboard
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/admin/dashboard-stats` | ✅ | Counts for the admin overview cards |

## What's still needed for production

- Swap SQLite for Postgres/MySQL if you expect concurrent write traffic at scale
- Move uploaded media to S3/Cloud Storage + a CDN instead of local disk
- Add HTTPS termination (required for `secure` cookies in production)
- Add CSRF protection if you introduce any cookie-authenticated non-JSON form posts
- Add email notifications on new contact/join submissions
- Connect the static front-end HTML pages to these endpoints (currently the HTML
  pages contain the same seeded content as static markup — wiring them to fetch
  from this API dynamically is the next step)
