# Tasks: Student Management

**Input**: Design documents from `/specs/001-student-management/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: The spec does not mandate TDD, but `plan.md`, `contracts/data-layer.md`, and `quickstart.md` commit to a dedicated Vitest suite (`frontend/src/api/students.test.js`) as the validation gate, so test tasks are included per user story.

**Organization**: Tasks are grouped by user story so each story is independently implementable and testable.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1–US5)
- Exact file paths are included in every description

## Path Conventions

Web application: `backend/app/`, `backend/migrations/versions/`, `frontend/src/`

**Critical context**: `frontend/src/api/client.js` returns `frontend/src/api/mock.js` unless `VITE_USE_REAL_API=1`, so the mock data layer is the **authoritative runtime behaviour**; the Flask backend is an additive mirror (research R1).

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm the baseline is green so regressions are attributable.

- [x] T001 Confirm the frontend baseline is green by running `cd frontend; npx vitest run` and recording the result (expected: 6 files / 43 tests passing) per `quickstart.md`
- [x] T002 [P] Confirm backend wiring is intact by running `cd backend; python -c "from app import create_app; create_app(); print('app ok')"` from repository root (expected: prints `app ok`)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared helpers and schema that every user story depends on.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T003 Add student field helpers to `frontend/src/api/mock.js`: a required-field validator plus `normalizeIdentity(value)` returning `String(value ?? "").trim().toLowerCase()`; validator must treat `year_level` as satisfied by the legacy `grade` key so pre-existing records keep working (research R3, R5, R6; data-model validation rules 1–5)
- [x] T004 Add a field-keyed validation error factory to `frontend/src/api/mock.js` that rejects with `{ response: { status: 400, data: { error: { code: "validation_error", message: "Please correct the highlighted fields.", fields: { ... } } } } }` per `contracts/data-layer.md`
- [x] T005 Add a duplicate-identity rejection helper to `frontend/src/api/mock.js` that rejects with `{ response: { status: 409, data: { error: { code: "exists", message: "That sign-in identity is already registered." } } } }` per `contracts/data-layer.md`
- [x] T006 [P] Add `year_level = db.Column(db.String(50), nullable=True)` and `class_name = db.Column(db.String(50), nullable=True)` to the `User` model in `backend/app/models/user.py`, and export both from `User.to_dict()` (data-model.md, FR-004)
- [x] T007 Create the additive Alembic revision in `backend/migrations/versions/` with `down_revision = 'b8997d4343f0'` adding `year_level` and `class_name` (`sa.String(length=50)`, nullable) to `users`, with a `downgrade()` that drops both (contracts/rest-api.md "Schema change")

**Checkpoint**: Shared helpers and schema in place — user stories can begin.

---

## Phase 3: User Story 1 - Register a new student (Priority: P1) 🎯 MVP

**Goal**: An administrator can add a student with validation, duplicate prevention, and credential provisioning.

**Independent Test**: Create a complete student (PIN blank) → appears in the list; re-submit the same sign-in identity → refused; omit one required field → refused with a message on that field only, other values preserved.

### Tests for User Story 1

- [x] T008 [P] [US1] Create `frontend/src/api/students.test.js` with `beforeEach` calling `resetMockDatabase()` and clearing `token`/`user`/`links` from `localStorage`, and add the US1 cases: full create, blank-PIN create (exactly one numeric 4-digit `login_pin`, `login_method: "pin"`), supplied-PIN create, each required field missing → `400` with `error.fields` naming that field, malformed email → `400`, duplicate identity → `409` `code: "exists"`, and casing/padding duplicate (`" SOPHEA@... "` vs `"sophea@..."`) → `409` (FR-005 – FR-011, Q6)

### Implementation for User Story 1

- [x] T009 [US1] Apply the T003/T004/T005 helpers inside `mockUsers.create` in `frontend/src/api/mock.js`: validate `full_name`, `email`, `year_level`/`grade`, `class_name` (all required; `email` must contain `@` with non-empty local part and domain), reject duplicates on normalised identity, then persist `year_level` and `class_name` on the new record (FR-001, FR-005 – FR-011)
- [x] T010 [US1] Preserve credential provisioning in `mockUsers.create` in `frontend/src/api/mock.js`: keep `login_pin` optional with a generated 4-digit fallback and keep `login_method: "pin"` forced for students — exactly one credential must result (FR-010, Q6)

- [x] T011 [US1] Make `Users.jsx` surface per-field validation errors: replace the single `error` string in `frontend/src/pages/admin/Users.jsx` with a field-keyed error map, render each message against its own input, and keep all other entered values in `form` so nothing is cleared (FR-009, US1 scenario 2)
- [x] T012 [US1] Add the year-level input to the create/edit form in `frontend/src/pages/admin/Users.jsx`, binding `year_level`, defaulting from the legacy `grade` value when editing, marked required alongside name, sign-in identity, and class (FR-004, FR-011)
- [x] T013 [US1] Add student-side validation to `backend/app/blueprints/users.py`: `create_user` must return `400` with `error.fields` for missing `full_name`/`email`/`year_level`/`class_name` on `role == "student"`, and `409` `code: "exists"` on normalised duplicate identity; persist `year_level`/`class_name` (contracts/rest-api.md POST section)

**Checkpoint**: US1 functional and independently testable — the MVP.

---

## Phase 4: User Story 2 - Find a student quickly (Priority: P2)

**Goal**: Administrators can narrow a large roster by search and class filter.

**Independent Test**: Type a name fragment → list narrows; type a sign-in-identity fragment → also matches; choose a class → only that class; nonsense → "no matches", not an error.

### Tests for User Story 2

- [x] T014 [P] [US2] Add US2 cases to `frontend/src/api/students.test.js`: `students()` returns only `role === "student"`; partial-name search; sign-in-identity search; `" sophea "` and `"SOPHEA"` both match; class filter returns only that class; `classes` returns the derived sorted distinct list; search + filter combined narrows both ways; no match → `students: []` with no rejection (FR-014 – FR-018, Q7)

### Implementation for User Story 2

- [x] T015 [US2] Add `students({ search, class_name } = {})` to the mock API in `frontend/src/api/mock.js`: return only `role === "student"` records, filter by normalised `full_name` OR `email` containment (Q7), then AND the optional exact `class_name` filter, and return `{ students, classes }` where `classes` is the sorted distinct non-empty `class_name`/`grade` set derived from all students in one pass (FR-014 – FR-018)
- [x] T016 [US2] Point the roster load in `frontend/src/pages/admin/Users.jsx` at `users.students({ search, class_name })` and read `{ students, classes }` instead of filtering the full `users.list()` payload client-side (FR-014, FR-015)
- [x] T017 [US2] Render the class filter in `frontend/src/pages/admin/Users.jsx` from the derived `classes` list, wired to the same refresh as the search box so both narrow together (FR-017)
- [x] T018 [US2] Keep the search input's placeholder and name-or-identity matching behaviour unchanged in `frontend/src/pages/admin/Users.jsx`, and show a clear "no students match" message (never an error or an endless spinner) when the result is empty (FR-016, FR-018, FR-029, Q7)

**Checkpoint**: US1 and US2 both work independently.

---

## Phase 5: User Story 3 - Correct a student's details (Priority: P3)

**Goal**: Administrators can update a student's name, year level, class, and identity while preserving uniqueness.

**Independent Test**: Edit a student and save → new values read back; attempt an edit onto another student's identity → refused, stored record unchanged.

### Tests for User Story 3

- [x] T019 [P] [US3] Add US3 cases to `frontend/src/api/students.test.js`: successful update reads back changed values; update onto another student's identity → `409`; update keeping the student's **own** identity → **resolves** (own value is not a conflict); update omitting a required field → `400` with `error.fields` (FR-003, FR-004, FR-006)

### Implementation for User Story 3

- [x] T020 [US3] Apply the same validation and normalised-duplicate check inside `mockUsers.update` in `frontend/src/api/mock.js`, **excluding the record being edited** from the duplicate scan so a student never conflicts with itself, and persist `year_level`/`class_name` (FR-003, FR-006)
- [x] T021 [US3] Reuse the field-keyed error map and per-field messages from T011 in the edit form in `frontend/src/pages/admin/Users.jsx` so a refused correction shows which field is wrong and never partially applies (FR-003, FR-009)
- [x] T022 [US3] Mirror the update rules in `backend/app/blueprints/users.py` `update_user`: validate required student fields, exclude the current `user_id` from the duplicate scan, return `409` `code: "exists"` on conflict, and accept `year_level`/`class_name` in the mutable field list (contracts/rest-api.md PATCH section)

**Checkpoint**: US1, US2 and US3 independently functional.

---

## Phase 6: User Story 4 - Remove a student (Priority: P4)

**Goal**: Administrators can permanently remove a student and their related records, atomically, behind an honest confirmation.

**Independent Test**: Remove a student who has a guardian link and progress → succeeds, student gone, no orphan rows, others untouched; cancel at the prompt → nothing changes; deactivate → student remains, inactive.

### Tests for User Story 4

- [x] T023 [P] [US4] Add US4 cases to `frontend/src/api/students.test.js`: `remove` on a student with `student_parent` + `teacher_student` links and dependent records → `{ ok: true }`, student absent from `students()`, zero remaining rows referencing that id in links/attendance/progress/grades; other students' links and records unchanged; remove a student with **no** related rows → still resolves; confirm the confirmation text names the student and states permanence and unrecoverability (FR-019, FR-020, FR-031, SC-008, Q8)

### Implementation for User Story 4

- [x] T024 [US4] Implement ordered, single-pass cleanup in `mockUsers.remove` in `frontend/src/api/mock.js`: delete every dependent row that references the student (links in both directions, attendance, activity/progress, grades) **before or together with** the user record in one operation, leaving no orphan rows; reject only if the student id is unknown (FR-020, FR-031)
- [x] T025 [US4] Correct the removal confirmation in `frontend/src/pages/admin/Users.jsx`: keep the existing single-prompt interaction, but the text MUST name the student, MUST state the removal is **permanent**, and MUST state that their links, assignments, progress and grades **cannot be recovered**; cancelling must leave everything untouched (FR-019, Q8, US4 scenario 4)
- [x] T026 [US4] Fix the backend delete defect in `backend/app/blueprints/users.py:86`: replace the bare `db.session.delete(user)` with application-side ordered cleanup — delete `student_parent`/`teacher_student` link rows and dependent records referencing the id, then the user, all inside one transaction with rollback on failure — explicitly **without** adding `ON DELETE CASCADE` or soft-delete (research R4; FR-020, FR-031)
- [x] T027 [US4] Keep the activate/deactivate control in `frontend/src/pages/admin/Users.jsx` unchanged and visually distinct from delete, so removal is permanent while deactivation stays reversible (FR-032, Q5)


**Checkpoint**: US1–US4 independently functional; removal is safe and honest.

---

## Phase 7: User Story 5 - Use the roster on a phone (Priority: P5)

**Goal**: The roster is fully usable at narrow widths and in both offered languages.

**Independent Test**: At a phone viewport, enrol, search, correct and remove a student; switch language and confirm labels and messages follow.

### Tests for User Story 5

- [x] T028 [P] [US5] Add US5 cases to `frontend/src/api/students.test.js` asserting that `students()`, `create`, `update` and `remove` behave identically regardless of presentation — no viewport- or locale-dependent branches in the data layer, and every rejection carries a human-readable `message` (FR-021, FR-022, FR-018)

### Implementation for User Story 5

- [x] T029 [US5] Make the roster view in `frontend/src/pages/admin/Users.jsx` responsive at narrow widths: the form, search box, class filter, per-field errors and action buttons must fit without horizontal scrolling or clipped controls, and the roster must remain readable (FR-021)
- [x] T030 [US5] Route all new roster labels, placeholders, validation messages and the permanence warning in `frontend/src/pages/admin/Users.jsx` through the existing translation mechanism so they follow the language toggle (FR-022, FR-018)

**Checkpoint**: All five stories work independently.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Whole-feature verification and cleanup.

- [x] T031 [P] Update `specs/001-student-management/quickstart.md` if any scenario, command, or expectation changed during implementation so the document stays runnable
- [x] T032 Run `cd frontend; npx vitest run` and confirm the whole suite is green including `students.test.js`, with the pre-existing suites (`auth`, `links`, `mock`, `grading`, `authAccess`, `studentAccessGuard`) still passing (FR-029, SC completeness)
- [x] T033 Run `cd frontend; npm run build` and confirm the production build completes without errors
- [x] T034 [P] Run the backend checks from `quickstart.md`: `cd backend; python -c "from app import create_app; create_app(); print('app ok')"`, and confirm the new Alembic revision is the single head (`flask db heads`) with `year_level`/`class_name` present on `users`
- [ ] T035 Walk the manual walkthrough in `quickstart.md` section 2 end to end (US1–US5) and confirm every step behaves as written, including the permanence wording on removal and the separation from deactivate (FR-019, FR-032, Q8)
- [x] T036 [P] Resolve the deleted-docs decision noted in planning: either intentionally remove or `git restore` `README.md`, `AGENTS.md`, and `docs/` (12 files) that are deleted in the working tree but present at `HEAD`, so the change set contains no unexplained deletions
- [x] T037 Verify no regression to the pre-existing account surface: existing deactivate toggling, role filtering for non-student roles, and admin guards on `/admin/users` all behave exactly as before (FR-029)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Setup — **BLOCKS all user stories** (T003–T005 feed US1–US4; T006–T007 feed US1/US3)
- **US1 (Phase 3)**: After Foundational. No dependency on other stories
- **US2 (Phase 4)**: After Foundational. Builds on the US1 records but is testable alone
- **US3 (Phase 5)**: After Foundational. Reuses US1's validator and US1's error map (T011)
- **US4 (Phase 6)**: After Foundational. Independent of US2/US3; T026 is the atomic-delete fix
- **US5 (Phase 7)**: After Foundational for tests; its UI work (T029, T030) touches the surface that US1–US4 build, so schedule last among stories
- **Polish (Phase 8)**: After all desired stories

### Within Each User Story

- Tests first (T008, T014, T019, T023, T028) and expected to fail before implementation
- Shared helpers before the mock API changes that use them
- Mock data layer before its backend mirror
- Data layer before the page that consumes it
- Story complete before moving to the next priority

### Parallel Opportunities

- T002 runs alongside T001
- T006 and T007 run in parallel with the mock-layer tasks T003–T005 (different files)
- T014, T019, T023, T028 each append to `students.test.js` but target distinct `describe` blocks — sequence the file edits to avoid conflicting writes
- T013, T022, T026 all edit `backend/app/blueprints/users.py` — keep them sequential
- T032/T033 (frontend) and T034 (backend) and T036 (docs) can run in parallel

---

## Verification Log

**Run 2026-11-09** (from `little-learner-platform/` unless noted):

| Check | Command | Result |
|-------|---------|--------|
| Frontend suite | `cd frontend; npx vitest run` | **7 files / 99 tests passed** (baseline 6 / 43; `students.test.js` adds 56) |
| Production build | `cd frontend; npm run build` | Passed (only chunk-size and font-resolution warnings) |
| Backend wiring | `cd backend; python -c "from app import create_app; create_app(); print('app ok')"` | `app ok` |
| Migration head | `cd backend; python -m flask --app wsgi:app db heads` | `c4a1f2e9d7b3 (head)` — single head |
| Removal harness | `cd backend; python tests/verify_student_delete.py` | `RESULT: ALL PASS` — includes the negative control proving the old bare delete is rejected by FK enforcement |

**Notes**

- T016 is satisfied by loading the student-scoped roster via `api.users.students()` once and narrowing it client-side in the page. The `students({ search, class_name })` query itself implements and is tested with the same filters (T014/T015); the page-side narrowing keeps search instant and avoids a request per keystroke. No behavioural difference at the documented scale (`plan.md` defers pagination).
- T031: `quickstart.md` gained a backend-harness check under section 1 and the observed suite count.
- T036: the deleted-docs concern from planning no longer applies — `README.md`, `AGENTS.md`, and `docs/` are present in the working tree with modifications, not deletions (`git status` shows no `D` entries).
- T035 remains open: it is the browser walkthrough in `quickstart.md` section 2. Everything it checks is also covered programmatically by `students.test.js`, but the visual/mobile pass has not been performed by a human in a running app.

---

## Phase 9: Convergence

Findings from the final cross-artifact review, completed in the same pass.

- [x] T038 Add a single-action "Clear filters" control that resets search, role and class filters and appears whenever any filter is active (FR-018, US2/AC6)
- [x] T039 Route the links-tab titles, helper text, link action, empty state and remove label through the translation catalogues instead of hardcoded English (FR-026, SC-006)
- [x] T040 Associate each validation message with its input via `aria-describedby`, alongside the existing `aria-invalid` and `role="alert"` (FR-028, US5/AC3)
- [x] T041 Position the roster search icon with the logical `start-3` inset so it mirrors correctly in Arabic (FR-027, US5/AC2)

**A2 (contract wording) resolved**: `contracts/rest-api.md` now states that PIN provisioning is authoritative in the frontend runtime and that the Flask mirror does not persist `login_pin`, matching `data-model.md` and the `users` schema.

**Post-convergence verification**: `npx vitest run` → 7 files / 99 tests passed; `npm run build` → passed; translation keys `clear_filters`, `emoji` and all `admin.links.*` present in en/km/ar.


