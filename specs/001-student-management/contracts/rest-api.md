# Contract: REST API — Users / Students

**Base**: `/api/v1/users` (registered in `backend/app/__init__.py:41`).
**Auth**: every endpoint is `@jwt_required()` and calls `admin_required()` (`users.py:10-15`), which returns `403 {"error":{"code":"forbidden","message":"Admin only"}}` for non-admins. This satisfies FR-012, FR-013, FR-022 and US1/US4 "not signed in as administrator" scenarios.
**Error envelope**: all failures use `{ "error": { "code": <string>, "message": <string> } }`.

## GET `/api/v1/users`

Existing, unchanged semantics. Returns every account.

**200**
```json
{ "users": [ { "id": 3, "email": "…", "role": "student", "full_name": "…",
              "preferred_lang": "km", "is_active": true, "login_method": "pin",
              "avatar": "bear" } ] }
```
Guarded by `admin_required()` (403 for non-admins).

## POST `/api/v1/users`

Creates an account. **Behaviour extended** for this feature.

**Request** (student registration)
```json
{ "full_name": "Sophea", "email": "sophea@…", "role": "student",
  "year_level": "Grade 2", "class_name": "2A",
  "preferred_lang": "km", "login_pin": "5678" }
```
`login_pin` is optional. **Credential provisioning is authoritative in the frontend runtime** (`mock.js`): a blank or absent PIN is generated as a 4-digit PIN and stored on the mock student record, which is the credential the child signs in with (FR-010, Q6). The Flask mirror accepts `login_pin` but does **not** persist it: the `users` table has no credential column (see `data-model.md`), and backend child sign-in uses the existing `login_token_hash` mechanism. Backend parity for PIN generation is deferred follow-up work and is not part of this feature's schema change.

**201** — the created user as `User.to_dict()`.

**400 — validation** (FR-005, FR-009, FR-011)
```json
{ "error": { "code": "validation_error",
             "message": "Please correct the highlighted fields.",
             "fields": { "email": "Email is required.",
                         "year_level": "Year level is required.",
                         "class_name": "Class is required." } } }
```
`fields` is keyed by field name so the UI can flag each offending field individually. Required: `full_name`, `email` (must be malformed-free), `year_level`, `class_name` for `role="student"`.

**409 — duplicate sign-in identity** (FR-006 – FR-008)
```json
{ "error": { "code": "exists", "message": "That sign-in identity is already registered." } }
```
Detected by comparing the trimmed, lower-cased `email` before insert, and ultimately guaranteed by the `UNIQUE` constraint on `users.email`, so two simultaneous requests cannot both succeed.

## PATCH `/api/v1/users/{id}`

Updates an account. **Behaviour extended**.

**Request** — any subset of `full_name`, `email`, `role`, `preferred_lang`, `is_active`, `login_method`, `avatar`, `year_level`, `class_name`, `password`.

**200** — the updated user as `User.to_dict()`.

**404** — `{"error":{"code":"not_found","message":"User not found"}}`.

**400 / 409** — same validation and duplicate semantics as POST, except that the record's **own** current `email` is not treated as a conflict.

## DELETE `/api/v1/users/{id}`

Permanently removes the account **and** its dependent rows. This is the FR-020 fix (R4).

**200** — `{"ok": true}`

**404** — `{"error":{"code":"not_found","message":"User not found"}}`.

**Required behaviour** (FR-020, Q3, SC-008): inside a single transaction, in dependency order, delete rows referencing the id —
`grades` (where `graded_by = id`, or via the student's `submissions`/`quiz_attempts`), `submissions` (via the student's `assignment_targets`), `quiz_answers` (via the student's `quiz_attempts`), `quiz_attempts` (`student_id = id`), `assignment_targets` (`student_id = id`), `lesson_progress` (`student_id = id`), `assignments` (`assigned_by = id`, after their targets), `student_parent` and `teacher_student` (where any column `= id`) — then `db.session.delete(user)` and a single `db.session.commit()`.
**Atomicity**: any failure must leave the database completely unchanged — no partially removed student.
**Explicitly not used**: no `ON DELETE CASCADE` schema change (FR-031); the cleanup is application-side and additive.

## POST `/api/v1/users/links`

Unchanged. Creates `StudentParent` and/or `TeacherStudent` rows from `{student_id, parent_id}` / `{teacher_id, student_id}`. Returns `{"ok": true}`.

## Schema change accompanying this contract

One additive Alembic revision on top of `b8997d4343f0` adds, on `users`:

| Column | Type | Nullable | Reason |
|--------|------|----------|--------|
| `year_level` | `String(50)` | yes (additive on an existing table) | Q4 — year level distinct from graded marks |
| `class_name` | `String(50)` | yes (additive on an existing table) | Q2 — class stored on the student |

`login_pin` is deliberately **not** added to the schema: it remains a frontend-runtime credential in `mock.js` (see the POST section), so the backend mirror does not persist it and no credential column is introduced by this feature.

Both are nullable at the database level so the migration applies to a populated `users` table without a backfill; the API enforces non-emptiness for student creation and edits (FR-005). `downgrade()` drops both columns.
