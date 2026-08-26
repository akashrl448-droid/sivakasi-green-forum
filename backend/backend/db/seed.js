// Seeds the database with the same content already used across the static front-end pages,
// so the dynamic site (once wired up) shows identical data on first run.
// Run with: node db/seed.js

const bcrypt = require('bcryptjs');
const { db } = require('./index');

function seed() {
  const adminCount = db.prepare('SELECT COUNT(*) AS c FROM admins').get().c;
  if (adminCount === 0) {
    const passwordHash = bcrypt.hashSync('ChangeMe123!', 10);
    db.prepare(
      `INSERT INTO admins (name, email, password_hash, role) VALUES (?, ?, ?, ?)`
    ).run('Rosa Mercado', 'admin@sivakasigreenforum.org', passwordHash, 'super_admin');
    console.log('✔ Seeded default admin (email: admin@sivakasigreenforum.org / password: ChangeMe123!)');
    console.log('  ⚠ Change this password immediately after first login.');
  }

  const teamCount = db.prepare('SELECT COUNT(*) AS c FROM team_members').get().c;
  if (teamCount === 0) {
    const team = [
      ['Mr. S. Bala Krishnan', 'President', 'Leadership', 'Founding member since 2020; leads institutional partnerships and long-term watershed strategy.', 1],
      ['Mr. S.S.A. Baskaran', 'Vice President', 'Leadership', 'Oversees field operations across all active restoration sites and volunteer scheduling.', 2],
      ['Mr. P. Kamaraj', 'Secretary', 'Leadership', 'Manages organizational records, government liaison, and grant documentation.', 3],
      ['Mr. K. Jai Sankar', 'Treasurer', 'Leadership', 'Handles finances, donor reporting, and budget planning across every active project.', 4],
      ['Meera Raghavan', 'Restoration Ecologist', 'Field Staff', 'Leads on-site restoration science across all active project sites.', 5],
      ['Arjun Vellaisamy', 'Water Resources Engineer', 'Field Staff', 'Designs water reconnection and desilting engineering plans.', 6],
      ['Divya Shankar', 'Community Programs Lead', 'Field Staff', 'Runs school and community engagement programs.', 7],
      ['Karthik Selvam', 'Field Coordinator', 'Field Staff', 'Coordinates volunteer days and on-site logistics.', 8],
      ['Priya Natarajan', 'Volunteer Coordinator', 'Field Staff', 'Manages volunteer onboarding and scheduling.', 9],
    ];
    const insert = db.prepare(
      `INSERT INTO team_members (name, designation, department, biography, display_order, is_published) VALUES (?, ?, ?, ?, ?, 1)`
    );
    team.forEach(t => insert.run(...t));
    console.log(`✔ Seeded ${team.length} team members`);
  }

  const projectCount = db.prepare('SELECT COUNT(*) AS c FROM projects').get().c;
  if (projectCount === 0) {
    const { newProjects } = require('./add_projects');
    const insert = db.prepare(`
      INSERT INTO projects (
        title, slug, category, project_category_tag, location,
        short_description, description, cover_image, gallery,
        start_date, end_date, expected_completion_date,
        objectives, impact, progress, status, display_order
      ) VALUES (
        @title, @slug, @category, @project_category_tag, @location,
        @short_description, @description, @cover_image, @gallery,
        @start_date, @end_date, @expected_completion_date,
        @objectives, @impact, @progress, @status, @display_order
      )
    `);
    newProjects.forEach(p => insert.run(p));
    console.log(`✔ Seeded ${newProjects.length} projects`);
  }

  const contentCount = db.prepare('SELECT COUNT(*) AS c FROM site_content').get().c;
  if (contentCount === 0) {
    const content = {
      about: {
        intro: "Sivakasi Green Forum was founded in 2020 by a small group of residents, students, and local business owners who watched the industrial city's water reserves and green cover shrink year after year.",
        history: "What started as informal weekend clean-up drives at one depleted lake grew into a structured, community-led environmental organization.",
        objectives: [
          'Restore degraded ecosystems',
          'Long-term monitoring',
          'Community stewardship',
          'Public awareness',
          'Institutional partnerships',
          'Prevent further deterioration',
        ],
      },
      mission_vision: {
        mission: 'Ensuring environmental safety and health, and protection of natural reservoirs; establishing a green environment and thereby paving the way for bio-diversity.',
        vision: 'A Sivakasi where every tributary, tank, and reservoir runs clean enough to sustain the community at its source.',
        core_values: ['Sustainability', 'Community-Led', 'Scientific Rigor', 'Transparency', 'Long-Term Stewardship', 'Environmental Responsibility'],
      },
      contact: {
        address: '15, Thiruthangal Road, Sivakasi, 626 123, Tamil Nadu, India',
        phone: '+91 77085 36365',
        email: 'sivakasigreenforum@gmail.com',
        map_lat: 9.4534,
        map_lng: 77.7936,
      },
      join_us: {
        intro: "Whether you have two hours or two seasons to give, there's a way to be part of the next restoration site.",
      },
    };
    const insert = db.prepare(`INSERT INTO site_content (content_key, content_json) VALUES (?, ?)`);
    Object.entries(content).forEach(([key, val]) => insert.run(key, JSON.stringify(val)));
    console.log('✔ Seeded site content (about, mission_vision, contact, join_us)');
  }
}

seed();
console.log('Database seed complete.');
