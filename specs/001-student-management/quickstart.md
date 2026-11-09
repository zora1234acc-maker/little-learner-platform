# Quickstart & Validation: Student Management

Runnable scenarios that prove the feature works end to end. Prerequisites, commands, and expected outcomes only — implementation details live in `tasks.md`.

## Prerequisites

- Node.js + npm/pnpm; dependencies already installed (`node_modules`, `frontend/node_modules`)
- Python 3.12 with `backend/requirements.txt` installed (needed only for the backend checks)
- Run all commands from `d:\assigment-python\little-learner-platform`

## 1. Automated validation (primary gate)

```powershell
cd frontend
npx vitest run
```

**Expected**: all suites pass, including the new `src/api/students.test.js`. Baseline before this feature was **43 tests / 6 files passing**; the module adds its own suite on top and must not break `auth.test.js`, `links.test.js`, `mock.test.js`, `grading.test.js`, `authAccess.test.jsx`, `studentAccessGuard.test.jsx`.

**Observed on 2026-11-09**: **7 files / 99 tests passed** (`students.test.js` contributes 56).

The new suite covers, at minimum:

| Scenario | Requirement | Expected |
|----------|-------------|----------|
| Create a complete student | FR-001, FR-003 | Resolves; `role: "student"`, `login_method: "pin"` |
| Create with a blank PIN | FR-010, Q6 | Resolves; record carries exactly one numeric 4-digit PIN |
| Create with a supplied PIN | FR-010, Q6 | Resolves; the supplied PIN is the one stored |
| Create with each required field missing | FR-005, FR-009, FR-011 | Rejects `400`; `error.fields` names exactly the offending field(s) |
| Create with a malformed email | FR-005 | Rejects `400` with an `email` message |
| Create a duplicate sign-in identity | FR-006 | Rejects `409`, `code: "exists"` |
| Re-submit with different casing/padding | FR-007, FR-008 | Still rejects `409` (`" SOPHEA@… "` vs `"sophea@…"`) |
| Update a student | FR-003 | Resolves; changed values read back |
| Update onto another student's identity | FR-006 | Rejects `409` |
| Update a student keeping its own identity | FR-006 | **Resolves** (own value is not a conflict) |
| List shows all students | FR-014, FR-015 | `students()` returns only `role === "student"` records |
| Search by partial name | FR-016 | Returns only matching students |
| Search by sign-in identity | FR-016, Q7 | Matches the email too |
| Search with padding/casing | FR-016 edge case | `" sophea "` / `"SOPHEA"` both match |
| Filter by class | FR-017 | Only that class's students; `classes` lists derived options |
| Search + filter combined | FR-016, FR-017 | Both narrow the result |
| No matches | FR-014, FR-017 | `students: []` — normal result, no rejection |
| Remove a student with links and records | FR-020, SC-008 | Resolves `{ok:true}`; student absent; no orphan rows remain |
| Remove leaves others untouched | FR-020, US4/4 | Other students, links and records unchanged |
| Remove a student with no related rows | FR-019 | Resolves without error |


## 2. Manual walkthrough (running app)

```powershell
cd frontend
npm run dev
```

Sign in as an administrator, then confirm each story in the browser at `http://localhost:5173`:

1. **Register (US1 / FR-001–011)** — open **Admin → Users**, choose the **Student** role filter (this reveals the class filter), and add a child with name, sign-in identity, year level and class, leaving the PIN blank. The child appears in the roster immediately. Re-add the same sign-in identity → refused with an explicit "already registered" message naming the field. Clear the class and submit → the save is refused with a message **on the class field only**, and the other typed values are still there.
2. **Find (US2 / FR-014–018)** — type part of a name → the list narrows; type part of a sign-in identity → it also matches; choose a class from the filter → only that class remains; type nonsense → a clear "no matches" message (not an error, not a permanent spinner).
3. **Correct (US3 / FR-003–004)** — edit a student's name, year level and class and save; the roster and the reopened record both show the new values. Try to save an edit that duplicates another student → refused with a conflict message and the stored record unchanged.
4. **Remove (US4 / FR-019–020)** — press delete on a student who has a guardian link and some progress. One confirmation appears naming the student and stating the removal is **permanent** and their links, assignments, progress and grades **cannot be recovered**. Cancel → nothing changes. Press delete again and confirm → the student disappears from the roster, searches and class filters, and the rest of the platform keeps working.
5. **Deactivate is not removal (Q5 / FR-032)** — use the Deactivate control; the student stays in the roster marked inactive and is still listed. Confirm it is presented as a separate action from delete.
6. **Phone (US5 / FR-021–022)** — resize to a narrow viewport and repeat one enrolment, search, correction and removal. No control is clipped or requires horizontal scrolling; switch language and confirm labels/messages follow.

## 3. Backend mirror (only when running the real API)

Automated removal-path check (no PostgreSQL needed — runs on in-memory SQLite with foreign keys enforced):

```powershell
cd backend
python tests/verify_student_delete.py
```

**Expected**: every row prints `PASS`, including `bare delete is rejected by FK (control)`, and the last line is `RESULT: ALL PASS`.

App wiring check:

```powershell
cd backend
python -c "from app import create_app; create_app(); print('app ok')"
```

**Expected**: prints `app ok` (imports and wiring intact). `python -m flask --app wsgi:app db heads` must show `c4a1f2e9d7b3 (head)` as the single head.

With a PostgreSQL instance available (`DATABASE_URL` set) and `VITE_USE_REAL_API=1` in `frontend/.env`:

1. `python -m flask --app wsgi:app db upgrade` — applies the additive `year_level`/`class_name` revision; both columns appear on `users`.
2. `POST /api/v1/users` with a complete student payload → `201`.
3. Repeat the same `email` in different casing → `409` with `code: "exists"`.
4. Omit `class_name` → `400` with `error.fields.class_name`.
5. Create a student, add a `student_parent` link via `POST /api/v1/users/links`, then `DELETE /api/v1/users/{id}` → `200 {"ok": true}`; the previously failing FK violation (R4, `users.py:86`) no longer occurs and no orphan link row remains.

## Definition of done

- `npx vitest run` is green with the new suite included.
- All 5 user stories are demonstrably satisfied by the scenarios above.
- FR-001 – FR-032 hold, with no regression to the pre-existing account surface (FR-029).
- `frontend` builds (`npm run build`) without errors.
