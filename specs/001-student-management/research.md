# Phase 0 Research: Student Management

All Technical Context unknowns are resolved below; no `NEEDS CLARIFICATION` markers remain. Facts were verified directly against the repository (paths and line numbers cited).

## R1 — Where does the module actually run? (mock vs. real API)

**Decision**: Implement the authoritative behaviour in the **frontend mock data layer** (`frontend/src/api/mock.js`) and mirror it in the Flask backend, because the frontend is mock-driven.

**Rationale**: `frontend/src/api/client.js` is explicit — it returns `mockApi` unless `import.meta.env.VITE_USE_REAL_API === "1"`, and even the "real" branch returns `mockApi` (`export const api = USE_REAL ? (() => { return mockApi; })() : mockApi;`). Every page imports `{ api } from "@/api/client"`. The running application therefore reads and writes `localStorage`-backed JSON seeded from `frontend/src/data/*.json`. Building only a backend endpoint would leave the feature non-functional as configured.

**Alternatives considered**: (a) Backend-only — rejected, the UI would never call it. (b) Flipping `VITE_USE_REAL_API=1` — rejected: it would require wiring every other module (content, CMS, grading, progress) to HTTP, far outside this feature's scope and a direct FR-029 regression risk.

## R2 — Which existing surface owns student accounts?

**Decision**: Extend `frontend/src/pages/admin/Users.jsx` with a student-focused roster; do not create a new page.

**Rationale**: `Users.jsx` already implements the complete lifecycle this feature requires for the `student` role: list (`api.users.list()`), create (`api.users.create`), edit (`api.users.update`), deactivate (`toggleActive`, `is_active`), delete (`removeUser`), and guardian/teacher linking. It already renders student-specific fields — `grade` and `class_name` (~lines 218, 345, 354) — and search already matches `full_name` or `email` (~lines 57–60) with the placeholder "Search by name or email..." (~line 179). A parallel page would duplicate all of this and risk divergence.

**Alternatives considered**: A new `/admin/students` page duplicating the roster — rejected as duplication contradicting FR-003 (reuse existing administrative conventions) and FR-029 (preserve existing functionality).

## R3 — How are "class" and "year level" stored?

**Decision**: As additive columns on the existing `users` table: `class_name` (class placement) and `year_level` (academic stage). The frontend keeps using `class_name` and adds `year_level`, while continuing to read the legacy `grade` key as the year-level value so no existing consumer regresses.

**Rationale**: Q2 (resolved) keeps class as a value on the student record, not a managed entity. Q4 (resolved) adds year level as a separate value distinct from graded marks. Evidence: the `users` ORM model (`backend/app/models/user.py`) and the initial migration (`backend/migrations/versions/b8997d4343f0_initial_migration.py`) contain **no** `class` or `year_level` column — so these are genuinely additive (FR-031). On the frontend, `class_name` is read by `Users.jsx`, `Dashboard.jsx`, `ChildProgress.jsx`, `Children.jsx`, `Assign.jsx`, `ClassProgress.jsx` and seed data; the year-level value currently lives under the legacy key `grade`. The spec avoids the word "grade" for the stage because `Grade` is also the marks entity (`backend/app/models/activity.py`, `mockGrading.grades`).

**Alternatives considered**: (a) Rename `grade` → `year_level` everywhere — rejected: it would break the year-level display in `Dashboard.jsx:132`, `ChildProgress.jsx:81`, `Children.jsx:54`, `Assign.jsx:313`, `ClassProgress.jsx:103` (FR-029). (b) Managed `classes` table — rejected by resolved Q2.


## R4 — How is the destructive delete made to work (FR-020)?

**Decision**: Perform an **explicit ordered cleanup of dependent rows inside one transaction** (and one synchronous block in the mock) covering every table that references `users.id`, then delete the user.

**Rationale**: This is the defect identified during clarification. `backend/app/blueprints/users.py:86` calls `db.session.delete(target)` and commits, but `student_parent` and `teacher_student` (`backend/app/models/link.py`) declare `ForeignKey("users.id")` with **no `ondelete` rule and no ORM relationship/cascade**, and the initial migration defines none either. Deleting a user that still has link rows raises a foreign-key violation instead of succeeding. Additional `users.id` references without cascade exist in `backend/app/models/activity.py`: `assignments.assigned_by`, `assignment_targets.student_id`, `lesson_progress.student_id`, `quiz_attempts.student_id`, plus `quiz_answers` (via `quiz_attempts`), `submissions` (via `assignment_targets`) and `grades.graded_by`. The mock (`mock.js` ~lines 315–326) already cleans up users plus both link collections but leaves assignments/progress/grades/attempts untouched. Both layers must be completed so FR-020 and SC-008 hold atomically.

**Alternatives considered**: (a) Database-level `ON DELETE CASCADE` — rejected as the primary mechanism: a destructive, non-additive schema change on existing tables (FR-031) that would silently widen deletion scope beyond what the administrator is shown. (b) Soft delete — rejected by resolved Q3 (permanent removal); Q5 already covers the reversible case via deactivation.

## R5 — How is duplicate detection implemented (FR-006 – FR-008)?

**Decision**: Reject creation/update when the normalised sign-in identity (email) already exists, case- and whitespace-insensitively, in **both** layers; the backend additionally relies on the existing `users.email UNIQUE` constraint so simultaneous attempts cannot both succeed.

**Rationale**: Q2 (resolved) keys uniqueness on sign-in identity. `backend/app/models/user.py:8` already declares `email = db.Column(db.String(255), unique=True, nullable=False, index=True)`, and `users.py:40-41` already returns HTTP 409 `{"error":{"code":"exists"}}` on conflict. The mock performs **no** duplicate check — `mockUsers.create` pushes a new record unconditionally (~line 301) — which is the gap to close. Normalising with `trim().toLowerCase()` satisfies FR-007; the check plus the DB constraint satisfies FR-008.

**Alternatives considered**: Keying on display name — rejected by Q2 (two children may share a name; see the spec edge case).

## R6 — Which fields are required, and how is the credential handled?

**Decision**: Required fields are display name, sign-in identity (email), year level, and class. The credential (PIN) is **optional**; when blank, generate a 4-digit PIN. Validation errors are reported **per field** while other entered values are preserved.

**Rationale**: Q4 makes year level and class required; Q6 (resolved) keeps the credential optional with auto-generation when blank. Existing behaviour confirms the pattern: `mockUsers.create` assigns `login_pin = data.login_pin || String(Math.floor(1000 + Math.random() * 8999))` for students (~line 300) and forces `login_method: "pin"` (~line 291); `Users.jsx` hard-requires only name and email (~line 86) and renders a "Login PIN" input. FR-009 requires per-field messages preserving other values, so validation moves from a single generic `error` string to a field-keyed error map.

**Alternatives considered**: Making the PIN required — rejected by resolved Q6 (Option A).

## R7 — Does the feature need new routing or navigation?

**Decision**: No new route. The student roster lives inside the existing `/admin/users` route (`App.jsx` ~line 128, `RoleRoute allowedRoles={["admin"]}`), which already enforces admin-only access (FR-012, FR-013, FR-022).

**Rationale**: The access guard is already correct and covered by `src/context/authAccess.test.jsx`. Adding a route would introduce a guard to re-verify for no benefit.

**Alternatives considered**: A dedicated route plus sidebar entry — rejected as unnecessary surface area; the sidebar already exposes `/admin/users`.

## R8 — Is any build or environment change needed to validate the work?

**Decision**: No. Validation runs the Vitest suites (which exercise `mock.js` directly) plus the Vite build; no environment flag changes.

**Rationale**: Existing suites import the mock modules directly (`import { mockAuth, mockUsers, resetMockDatabase } from "./mock"` in `auth.test.js`), so the new suite follows the same pattern and runs without a server. Baseline confirmed green: 43 tests / 6 files passing.
