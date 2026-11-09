# Implementation Plan: Student Management

**Branch**: `001-student-management` | **Date**: 2026-11-09 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-student-management/spec.md`

## Summary

Deliver the Student Management module for Little Learner Platform: administrators register, find, correct, and permanently remove students of the `student` role, with validation, duplicate prevention on sign-in identity, name/sign-in-identity search, class filtering, and mobile-first, localized UI.

**Technical approach**: This feature is **additive over the existing administrative account surface**, not a new subsystem. The repository is frontend-first: `frontend/src/api/client.js` returns `frontend/src/api/mock.js` (local JSON + `localStorage`) unless `VITE_USE_REAL_API=1`, and `frontend/src/pages/admin/Users.jsx` already creates, edits, lists, deactivates and deletes accounts of every role. The work therefore concentrates on (1) hardening `mockUsers` (validation, duplicate rule, atomic ordered delete cleanup, student roster query/filter) and `Users.jsx` (student roster, class filter, per-field validation, permanence-warning confirmation), and (2) mirroring those guarantees in the Flask/PostgreSQL backend (`users.py`, migration) so both stay behaviourally equivalent. No existing behaviour is removed (FR-029).

## Technical Context

**Language/Version**: Python 3.12 (backend; verified `python --version` → 3.12.7) and JavaScript/JSX with React 18 (frontend)

**Primary Dependencies**: Backend — Flask 3.0.0, Flask-SQLAlchemy 3.1.1, Flask-Migrate 4.0.4, Flask-JWT-Extended 4.6.0, Flask-CORS 4.0.0, marshmallow 3.20.1, psycopg2-binary 2.9.9, Flask-Bcrypt 1.0.1, python-dotenv. Frontend — React 18.3.1, react-router-dom 6.26, i18next/react-i18next, TailwindCSS 3.4, antd 6, axios 1.7, lucide-react, Vitest 2.1.9, @testing-library/react 16, jsdom (`frontend/vitest.config.js`)

**Storage**: PostgreSQL via SQLAlchemy + Alembic (`DATABASE_URL`, default `postgresql+psycopg2://littlelearner:littlelearner@localhost:5432/littlelearner`). Frontend data layer is `localStorage`-backed JSON seeded from `frontend/src/data/*.json` (db key `ll_mock_db_v2`, links key `links`)

**Testing**: Vitest (`cd frontend; npx vitest run`); existing suites `src/api/auth.test.js`, `grading.test.js`, `links.test.js`, `mock.test.js`, `src/context/authAccess.test.jsx`, `studentAccessGuard.test.jsx` — baseline **43 passing / 6 files**

**Target Platform**: Web (mobile-first responsive); Vite dev server + Flask API

**Project Type**: Web application — `backend/` (Flask API) + `frontend/` (React SPA)

**Performance Goals**: Roster of 500 students: name/sign-in-identity search answers in under 10 seconds (SC-003) — met by in-memory filtering; no pagination work needed at this scale

**Constraints**: PostgreSQL only (FR-023); additive schema changes only (FR-031); preserve existing behaviour and UI conventions (FR-029, FR-003); no new dependencies

**Scale/Scope**: One administrative surface (~1 page) plus 2 API endpoints touched; 8 seed accounts; 500-student design point


## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

`.specify/memory/constitution.md` is an **unratified template** — it still contains `[PROJECT_NAME]`, `[PRINCIPLE_1_NAME]`, `[GOVERNANCE_RULES]` and `[CONSTITUTION_VERSION]` placeholders, with no ratified principles or governance rules. There are therefore **no binding constitutional gates** for this feature, and no violations to justify.

| Gate | Status | Notes |
|------|--------|-------|
| Ratified principles | N/A | Constitution is an unfilled template; no principles exist to gate on |
| Complexity justification | Pass | No new projects, layers, or patterns introduced — the feature extends existing files |
| Clarifications resolved | Pass | Q1–Q8 all resolved in `spec.md` → `## Clarifications`; `### Open` is `_None._` |
| Database engine | Pass | PostgreSQL only (FR-023); MySQL explicitly out of scope (Q1) |


## Project Structure

### Documentation (this feature)

```text
specs/001-student-management/
├── plan.md              # This file (/speckit-plan command output)
├── spec.md              # Feature specification (Q1–Q8 resolved)
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   ├── rest-api.md      # Backend HTTP contract
│   └── data-layer.md    # Frontend mock data-layer contract
├── checklists/
│   └── requirements.md  # Spec-quality checklist (all items pass)
└── tasks.md             # Phase 2 output (/speckit-tasks command)
```

### Source Code (repository root)

```text
backend/
├── app/
│   ├── blueprints/
│   │   ├── auth.py              # reuse unchanged (inactive accounts already blocked)
│   │   └── users.py             # EDIT: validation, 409 conflicts, atomic ordered delete
│   ├── models/
│   │   ├── user.py              # EDIT: add year_level + class_name columns
│   │   └── link.py              # reference only (FKs to users.id, no cascade)
│   └── __init__.py              # reuse unchanged
└── migrations/versions/
    └── <new>_add_student_year_level_and_class.py   # NEW: additive columns

frontend/
└── src/
    ├── api/
    │   ├── mock.js              # EDIT: mockStudents roster + validation/duplicate/delete
    │   ├── students.test.js     # NEW: Vitest suite for the student module
    │   └── client.js            # reference only (mock unless VITE_USE_REAL_API=1)
    ├── pages/admin/
    │   └── Users.jsx            # EDIT: student roster tab, class filter, inline errors
    └── data/users.json          # reference only (seed accounts incl. grade, class_name)
```

**Structure Decision**: Web-application layout (`backend/` + `frontend/`) already present in the repository; no new top-level directories. The feature is implemented **in the existing administrative surface** (`Users.jsx` gains a student-focused roster tab) rather than a parallel page, because that surface already owns account creation, editing, deactivation, linking and deletion for the `student` role, and a parallel page would duplicate it and risk regressing working behaviour (FR-029, FR-003).

## Complexity Tracking

> No constitutional violations. No entries required.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| _None_ | — | — |

**Post-Phase-1 re-check**: still passes. The design adds one additive migration and no new architectural layer, so no principle could be violated even if the constitution were later ratified in its current shape.
