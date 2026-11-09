# Phase 1 Data Model: Student Management

Entities are the **existing** platform entities this feature touches. Additive fields are marked `[ADD]`; nothing existing is removed or renamed (FR-031).

## Student (a `User` with `role = "student"`)

Physical names: SQL table `users` (`backend/app/models/user.py`); frontend record inside `db.users.users` (`frontend/src/data/users.json`, seeded accounts `u3`, `u5`, `u8`).

| Field | Type / constraint | Required | Notes |
|-------|-------------------|----------|-------|
| `id` | integer, PK (backend) / string like `u9` (frontend) | yes | Generated on create (`nextId("u")` in the mock) |
| `full_name` | `String(255)`, NOT NULL; frontend string | **yes** | The student's display name (FR-005). Not a uniqueness key (Q2) |
| `email` | `String(255)`, NOT NULL, **UNIQUE**, indexed | **yes** | The student's sign-in identity (FR-010); the duplicate-detection key (FR-006). Compared case- and whitespace-insensitively (FR-007) |
| `role` | enum `admin\|teacher\|student\|parent`, NOT NULL | yes | Always `"student"` for this feature; scopes the roster claim (FR-018) |
| `year_level` | `String(50)`, NULL `[ADD]` | **yes** | Academic stage, e.g. `"Grade 2"` (Q4). Frontend additionally reads the legacy `grade` key for display |
| `class_name` | `String(50)`, NULL `[ADD]` | **yes** | Class placement, free text, e.g. `"2A"` (Q2, FR-016/FR-017). Existing frontend key — preserved |
| `login_pin` | `String(20)`, NULL (frontend only, stripped by `plainUser`) | no | Child credential. Optional on the form; **auto-generated 4-digit** when blank (Q6, FR-010) |
| `login_method` | enum `password\|qr\|pin\|picture` | yes | Forced to `"pin"` for students (existing behaviour, preserved) |
| `is_active` | boolean, default true | yes | Deactivation flag — distinct from removal (Q5, FR-032) |
| `preferred_lang` | `String(10)`, default `"en"` | no | Localization of the student's own experience (FR-021) |
| `avatar`, `avatar_url`, `phone` | string, NULL | no | Existing pass-through fields, unchanged |
| `password_hash`, `login_token_hash` | `String(255)`, NULL | no | Never exposed to the UI (`plainUser` strips `password_hash`, `login_token_hash`, `login_pin`) |
| `created_at`, `updated_at` | datetime, server default | yes | Unchanged |

**Validation rules** (FR-005, FR-009, FR-011):
1. `full_name` — required, non-empty after trimming.
2. `email` — required, non-empty after trimming, must contain `@` with a non-empty local part and domain.
3. `year_level` — required, non-empty after trimming.
4. `class_name` — required, non-empty after trimming.
5. `login_pin` — optional; when supplied must be non-empty after trimming; when blank the platform generates one.
6. Every violation is reported **against its own field**, and the values the administrator already typed for the other fields are preserved.

**Uniqueness rule** (FR-006 – FR-008): normalise `email` as `trim().toLowerCase()`; if a **different** user already holds that value, refuse with a conflict naming the sign-in identity. On edit, the student's own current value is not a conflict. Enforced before insert, and backed on the backend by the `UNIQUE` constraint on `users.email`.

**State transitions**:
- `absent → active`: registration (US1) — default state.
- `active ⇄ inactive`: **deactivation/activation** (pre-existing control, preserved; FR-029, FR-032). Record and history intact; sign-in blocked (backend `auth.py:16`, `mockAuth.login`).
- `active|inactive → absent`: **permanent removal** (US4). Irreversible, confirmed first (FR-019, Q3), and removes dependent rows atomically (FR-020, R4).

## Link (guardian/teacher ↔ student)

`backend/app/models/link.py`; frontend `db.users.links` (`student_parent`, `teacher_student`).

| Entity | Columns | Notes |
|--------|---------|-------|
| `StudentParent` (`student_parent`) | `student_id` FK→`users.id` (PK), `parent_id` FK→`users.id` (PK) | No `ondelete`/cascade — drives the R4 cleanup; record-shaped in the mock |
| `TeacherStudent` (`teacher_student`) | `teacher_id` FK→`users.id` (PK), `student_id` FK→`users.id` (PK) | Same |

**Deletion rule** (FR-020): when a user is removed, drop every row where the removed id appears in **either** column, for both tables. Frontend also mirrors the result into the separate `links` localStorage key (existing `persistLinks`, preserved), and the `teacher_student` create path's `{student_id, teacher_id}` shape is preserved as the `links.test.js` suite asserts it.

## Dependent learning records (removal ordering — R4/FR-020)

The mock must also clear, for the removed student, in this order: `db.attempts`, `db.grades` (via submissions/attempts), `db.submissions` (via targets), `db.assignments.targets` entries and assignments owned by the user, `db.users.links` (both tables), then `db.users.users`. The backend must clear the FK-bearing tables in dependency order (`grade`, `submission`, `quiz_answer`, `quiz_attempt`, `assignment_target`, `lesson_progress`, `assignment`, `link`) before `users`, all inside one transaction and one `commit()` — a failure must roll back the whole removal (atomicity, FR-020).

## Class filter options (derived, not stored)

Not an entity (Q2). The class filter's option list is **derived at render time** from the `class_name` values present in the roster, sorted, with empty values excluded. Deriving rather than curating keeps the filter always consistent with real data (FR-017).

## Relationships

```text
User (student) 1 ──── * StudentParent * ──── 1 User (parent)
User (student) 1 ──── * TeacherStudent * ──── 1 User (teacher)

User (student) 1 ──── * assignment_targets ──── 1 Assignment ──── 1 User (assigned_by, teacher)
User (student) 1 ──── * lesson_progress
User (student) 1 ──── * quiz_attempts ──── * quiz_answers
User (student) 1 ──── * assignment_targets ──── * submissions ──── * grades
```

All of these hang off the student record, which is why removal cannot be a bare `DELETE` on `users` (R4).
