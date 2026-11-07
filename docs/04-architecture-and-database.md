# 04 – Architecture and Database

## Folder structure
```
little-learner/
├── backend/
│   ├── app/
│   │   ├── __init__.py          # create_app(), extensions
│   │   ├── config.py
│   │   ├── models/              # SQLAlchemy models
│   │   ├── blueprints/          # auth, users, content, assign, progress, cms, media
│   │   ├── services/            # business logic (scoring, assigning)
│   │   ├── utils/               # decorators (roles), i18n helper, pagination
│   │   └── schemas/             # marshmallow/pydantic validation
│   ├── migrations/              # Alembic
│   ├── tests/
│   ├── requirements.txt
│   └── wsgi.py
└── frontend/
    ├── src/
    │   ├── api/                 # axios client + per-module calls
    │   ├── i18n/                # react-i18next, en.json km.json ar.json
    │   ├── components/          # shared UI (Header, Footer are DATA-DRIVEN)
    │   ├── pages/
    │   │   ├── public/          # Home, DynamicPage, Login
    │   │   ├── admin/           # Users, Content, Site settings, Menus, Pages
    │   │   ├── teacher/         # Library, Assign, Grading, Class progress
    │   │   ├── student/         # Todo, Lesson, Quiz, Submit
    │   │   └── parent/          # Children, Progress
    │   ├── store/               # auth + site settings (context or zustand)
    │   └── routes/              # role-protected routes
    └── vite.config.js
```

## Backend stack
Flask, Flask-SQLAlchemy, Flask-Migrate (Alembic), Flask-JWT-Extended, Flask-CORS, marshmallow, psycopg2, bcrypt. Uploads go to S3-compatible storage (local folder in dev).

## Translatable fields
Use **JSONB**: `{"en": "Letters", "km": "អក្សរ", "ar": "الحروف"}`. Helper `t(field, lang)` returns `field[lang]`, else `field["en"]`.

## Database tables
**Identity**
- `users` (id, email/username, password_hash, role ENUM[admin,teacher,student,parent], full_name, preferred_lang, is_active)
- `student_parent` (student_id, parent_id)
- `teacher_student` (teacher_id, student_id)
- `classes` (id, name, teacher_id), `class_members` (class_id, student_id)

**Content** (all titles/descriptions are JSONB translatable; `status` = draft|published)
- `subjects`, `courses` (subject_id), `lessons` (course_id, type video|reading, video_url, body JSONB, position)
- `quizzes` (lesson_id or course_id), `questions` (quiz_id, text JSONB, image_url), `question_options` (question_id, text JSONB, is_correct)
- `assignment_templates` (course_id, title JSONB, instructions JSONB)

**Activity**
- `assignments` (id, item_type lesson|quiz|assignment, item_id, assigned_by, due_date)
- `assignment_targets` (assignment_id, student_id, status, completed_at)
- `lesson_progress`, `quiz_attempts` (score, max_score), `quiz_answers`
- `submissions` (target_id, file_url, text, submitted_at), `grades` (submission_id, score, comment JSONB/text, graded_by)

**Website CMS**
- `site_settings` (key, value JSONB): site_name, logo_url, colors, contact, social
- `menu_items` (id, location header|footer, label JSONB, url, position, parent_id, is_visible)
- `footer_blocks` (id, title JSONB, content JSONB, position)
- `pages` (id, slug, title JSONB, status, seo JSONB), `page_sections` (page_id, type, content JSONB, position)

**Support:** `media_files`, `notifications`, `audit_log` (user_id, action, entity, entity_id, at).

## API (prefix `/api/v1`)
| Area | Endpoints |
|---|---|
| Auth | `POST /auth/login`, `GET /auth/me`, `POST /auth/refresh` |
| Users (admin) | `GET/POST /users`, `PATCH/DELETE /users/:id`, `POST /users/links` |
| Content (admin write, others read published) | `/subjects`, `/courses`, `/lessons`, `/quizzes`, `/questions`, `/assignment-templates` |
| Assign | `POST /assignments`, `GET /assignments/mine` (student), `GET /assignments/created` (teacher) |
| Learning | `POST /lessons/:id/complete`, `POST /quizzes/:id/attempt`, `POST /targets/:id/submit` |
| Grading | `GET /grading/queue`, `POST /submissions/:id/grade` |
| Progress | `GET /progress/student/:id`, `GET /progress/class/:id`, `GET /parent/children` |
| **Public CMS** (no auth) | `GET /public/site`, `GET /public/menus`, `GET /public/pages/:slug`, `GET /public/home` (all accept `?lang=`) |
| **Admin CMS** | `PUT /cms/settings`, CRUD `/cms/menu-items`, `/cms/footer-blocks`, `/cms/pages`, `/cms/pages/:id/sections` |
| Media | `POST /media/upload` |

Responses are JSON. Errors: `{ "error": { "code": "...", "message": "..." } }`.
