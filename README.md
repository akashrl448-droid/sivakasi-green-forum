# Sivakasi Green Forum (SGF) 🌿

A web application and management platform for the **Sivakasi Green Forum** — an environmental NGO dedicated to afforestation, water body rejuvenation, native biodiversity preservation, and urban greening in Sivakasi and surrounding regions.

---

## 🚀 Features

- **Responsive Frontend:**
  - Complete public portal: Home, About Us, Mission & Vision, Completed/Ongoing/Upcoming Projects, Project Detail pages, Team, Join Us, and Contact Us.
  - Interactive Admin Panel (`admin-dashboard.html`) for managing projects, team members, contact submissions, volunteer requests, and editable site content.
- **Backend API (Node.js + Express):**
  - Secure JWT authentication with HTTP-only cookies and bcrypt password hashing.
  - SQLite database (`better-sqlite3`) with schema migrations and seed scripts.
  - Express-validator input validation, rate limiting, and CORS security.
  - Media upload handling with `multer` supporting single and gallery uploads.
  - RESTful endpoints for projects, team, inquiries, join requests, and dynamic site content.

---

## 📂 Project Structure

```text
├── frontend/                     # Static HTML, CSS, and JS web pages
│   ├── index.html                # Homepage
│   ├── about.html                # About Us
│   ├── mission-vision.html       # Mission & Vision
│   ├── projects-completed.html   # Completed Projects
│   ├── projects-ongoing.html     # Ongoing Initiatives
│   ├── projects-upcoming.html    # Upcoming Projects
│   ├── project-detail.html       # Dynamic Project Details
│   ├── team.html                 # Team Directory
│   ├── join-us.html              # Volunteer / Membership Form
│   ├── contact.html              # Contact Form
│   ├── admin-login.html          # Admin Portal Login
│   └── admin-dashboard.html      # Comprehensive Admin Management UI
├── backend/backend/              # Express API Server
│   ├── db/                       # Database schema, seed data, and connection
│   ├── middleware/               # Auth, rate-limiter, and validation middleware
│   ├── routes/                   # API routes (auth, projects, team, content, etc.)
│   ├── uploads/                  # Uploaded assets
│   ├── server.js                 # Server entry point
│   ├── .env.example              # Example environment configuration
│   └── package.json              # Backend dependencies
├── project_report.md             # Project documentation & summary report
└── package.json                  # Root scripts
```

---

## 🛠️ Getting Started

### 1. Prerequisites
- Node.js (v16+ recommended)
- npm

### 2. Backend Setup
```bash
cd backend/backend
npm install
cp .env.example .env     # Update JWT_SECRET for production
node db/seed.js          # Initialize and seed database
npm run dev              # Run server on http://localhost:4000
```

### 3. Frontend Setup
Open `frontend/index.html` in your browser or serve it using a local server (e.g. VS Code Live Server or `npx serve frontend` on port 5500).

---

## 🔐 Default Admin Credentials (Development)
- **Email:** `admin@sivakasigreenforum.org`
- **Password:** `ChangeMe123!`

*(Make sure to change the default password upon deployment via the admin settings).*
