# AGENTS.md – Build Instructions for the Coding Agent

## Before you start
1. Read `README.md`, then everything in `docs/`. Docs 07–10 come from research: `docs/10-feature-updates.md` overrides `docs/02` where they conflict.
2. If something is unclear, ask ONE question at a time. Otherwise follow the decisions in `README.md`.
3. Work phase by phase. Finish and test each phase before the next. Commit after each phase.

## Hard rules
- Stack is fixed: React + Vite, Flask, PostgreSQL. No other frameworks for these layers.
- **No hardcoded website text.** Header, footer, menus and pages come from the API (`docs/05`).
- All user-facing content fields are multilingual JSONB (`en`, `km`, `ar`) with English fallback.
- RTL must work for Arabic using logical CSS properties.
- No public registration. Only admin creates users.
- Every route checks role AND ownership (`docs/03`).
- Passwords hashed with bcrypt. Secrets in `.env`, never in git. Validate all input. Sanitize rich text.
- Write tests for auth, permissions, scoring, and CMS endpoints.
- Do not add payments, messaging, or teacher authoring.
- **Child privacy (`docs/08`):** collect the minimum, no ads, no third-party trackers, never send child data to external AI/analytics, keep a retention policy and publish it via the CMS. Record every external service in `docs/third-party-services.md`.
- **Mobile-first and light:** compress images, lazy-load media, keep pages small. Many users are on phones with limited data.
- Students log in by QR code, PIN, or picture (no typing required for young kids), per `docs/10`.

## Phases

### Phase 1 – Foundation
- Create the folder structure in `docs/04`.
- Flask app factory, config, SQLAlchemy, Alembic, CORS, error handler.
- Vite React app with router, axios client, react-i18next (en/km/ar), `dir` switching.
- `docker-compose.yml` with Postgres. `.env.example`.
- **Done when:** `GET /api/v1/health` works and the React app shows a translated page with RTL toggle.

### Phase 2 – Auth, roles, users
- `users` model, login, JWT, `/auth/me`, role decorator, seed script for first admin.
- Admin UI: users table, create/edit/deactivate, link manager (Parent↔Student, Teacher↔Student).
- Role-protected frontend routes and a dashboard shell per role.
- Kid-friendly login: QR/PIN token login, printable login card PDF, multiple children per parent (`docs/10`).
- **Done when:** each role logs in and sees only its own area. Tests prove a teacher cannot read unlinked students.

### Phase 3 – Website CMS (core requirement)
- Tables: `site_settings`, `menu_items`, `footer_blocks`, `pages`, `page_sections`.
- Public endpoints and admin endpoints from `docs/04`.
- Frontend: `SiteContext`, data-driven `Header` and `Footer`, section registry, `DynamicPage`, homepage from API.
- Admin screens: settings, menus (reorder), footer, pages editor with EN/KM/AR tabs, media upload.
- Seed the default homepage matching `docs/06` design.
- **Done when:** admin edits a menu label and footer text in the dashboard and the public site shows it after refresh, in all 3 languages, with no code change.

### Phase 4 – Content library
- Models and admin CRUD for subjects, courses, lessons, quizzes, questions, options, assignment templates. Draft/Published.
- Admin content tree UI with language tabs.
- Read-only library browser for teachers.
- **Done when:** admin builds a full course in 3 languages and teacher can browse it.

### Phase 5 – Assign, learn, quiz
- Assignment creation (teacher), `assignment_targets` per student.
- Student "My to-do", lesson player (video embed + reading), mark complete.
- Quiz taker with server-side scoring (never trust client score), instant kid-friendly feedback.
- **Done when:** teacher assigns a quiz, student completes it, score is stored and visible to teacher.

### Phase 6 – Submissions and grading
- File/text submission, media upload validation (type and size limits).
- Teacher grading queue, score + comment, return to student.
- **Done when:** full assignment lifecycle `assigned → submitted → graded` works.

### Phase 7 – Progress and parent dashboard
- Progress endpoints and student progress screen.
- Parent dashboard: children list, per-child progress, scores, feedback, overdue.
- Teacher class progress view.
- **Done when:** parent sees only own children and data matches teacher view.

### Phase 8 – Hardening
- Audit log on admin writes, rate limiting on login, security headers, HTTPS config.
- Privacy: consent records, export/delete student data, daily retention cleanup job, seeded admin-editable Privacy and Data Retention pages (`docs/08`).
- Accessibility pass, mobile pass, test all pages in en/km/ar.
- README run/deploy instructions.

### Phase 9 – Should-haves (only after 1–8 pass)
Classes, notifications, badges, CSV import, extra quiz types, reports, audio read-aloud, PWA offline reading, library search/filters, printable parent invites (`docs/10`).

## Definition of done (every phase)
- Code runs locally from a clean clone using documented steps.
- Tests pass. No secrets committed.
- UI works on mobile, and in en, km, ar (RTL).
- Update the checklist below.

## Progress checklist
- [ ] P1 Foundation
- [ ] P2 Auth and users
- [ ] P3 Website CMS
- [ ] P4 Content library
- [ ] P5 Assign, learn, quiz
- [ ] P6 Submissions and grading
- [ ] P7 Progress and parent
- [ ] P8 Hardening
- [ ] P9 Should-haves
