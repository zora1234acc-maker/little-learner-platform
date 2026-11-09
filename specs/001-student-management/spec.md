# Feature Specification: Student Management

**Feature Branch**: `001-student-management`

**Created**: 2026-11-09

**Status**: Draft

**Input**: User description: "Create a Student Management module for Little Learner Platform. Requirements: Admin can register new students; Admin can edit student information; Admin can delete students; Admin can view all students; Search students by name; Filter students by class; Store student information in MySQL; Validate all required fields; Prevent duplicate student registration; Provide a responsive React interface. Important: Inspect my existing project before proposing changes. Preserve existing functionality."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Register a new student (Priority: P1)

An administrator opens the student roster and adds a new child to the platform, entering the child's identifying details, year level, and class placement. The system refuses incomplete entries and entries that duplicate an existing student's sign-in identity, then confirms the child is now enrolled and visible in the roster.

**Why this priority**: Enrolment is the gate for everything else. A student cannot be assigned lessons, tracked for progress, or linked to a parent until the record exists. Without this story the module delivers no value at all.

**Independent Test**: From a roster containing no students, submit a complete new-student form as an administrator; confirm the student appears in the roster and can be reopened. Submit the identical details again and confirm the second attempt is refused. Fully testable with only this story implemented.

**Acceptance Scenarios**:

1. **Given** an administrator is signed in, **When** they submit a new-student form with every required field populated, **Then** the student is created and immediately listed in the roster.
2. **Given** an administrator submits a new-student form, **When** one or more required fields are empty or malformed, **Then** no record is created, each offending field is flagged with a specific message, and the administrator's other entered values are preserved.
3. **Given** a student with a given identity already exists, **When** the administrator submits a new student with that same identity, **Then** creation is refused with an explicit "already registered" message naming the conflicting field.
4. **Given** an administrator is using a phone-sized screen, **When** they open and complete the new-student form, **Then** every field and action remains reachable and usable without horizontal scrolling.
5. **Given** an administrator registers a student, **When** they leave the child's sign-in credential blank, **Then** the platform generates one automatically and the child can sign in with it; **When** they supply one instead, **Then** that supplied credential is the single one the child uses (Clarification Q6).
6. **Given** an administrator is not signed in as an administrator, **When** they attempt to register a student, **Then** the attempt is refused and no record is created.

---

### User Story 2 - Find students in the roster (Priority: P2)

An administrator views the full list of students and narrows it down — by typing part of a name, and/or by choosing a class — until the child they need is visible.

**Why this priority**: A roster that cannot be searched becomes unusable once it grows past a screenful. It is the most frequently repeated interaction and it is the read path that makes editing and removal reachable, but the module still delivers value with only enrolment working.

**Independent Test**: With students spread across at least two classes, confirm the list shows all of them, that a partial-name search returns only matching students, and that choosing a class returns only that class's students. Works with editing and removal left unimplemented.

**Acceptance Scenarios**:

1. **Given** students exist, **When** the administrator opens the roster, **Then** every student is listed with at least their name, class, and year level.
2. **Given** the roster is displayed, **When** the administrator types a partial name in any letter casing, **Then** every student whose name contains that fragment is shown.
3. **Given** the roster is displayed, **When** the administrator types part of a student's sign-in identity, **Then** that student is shown too, so the roster can be searched by name or by sign-in identity (Clarification Q7).
4. **Given** the roster is displayed, **When** the administrator selects a class, **Then** only students placed in that class are shown.
5. **Given** a search term and a class are both applied, **When** both are active, **Then** the results satisfy both conditions together.
6. **Given** a filter combination matches nobody, **When** the roster renders, **Then** an explicit empty-state message is shown and the filters can be cleared in a single action.
7. **Given** an administrator runs the same search on a phone and on a desktop, **When** results are shown, **Then** the search and filter controls are usable and the results stay legible at both sizes.

---

### User Story 3 - Correct a student's information (Priority: P3)

An administrator opens an existing student's record from the roster, changes something that was entered incorrectly or has since changed — a spelling, a class move, an updated guardian contact — and saves it.

**Why this priority**: Records drift; a roster nobody can correct becomes untrustworthy and pushes administrators back to manual workarounds. Valuable on its own, but only meaningful once students exist and can be found.

**Independent Test**: Open a previously created student, change the name, year level, and class, save, and confirm both the roster list and the reopened record show the new values. Requires only enrolment and the roster list to be present.

**Acceptance Scenarios**:

1. **Given** a student exists, **When** the administrator opens that student and saves changed details, **Then** the record shows the new values everywhere the student appears.
2. **Given** an administrator edits a student, **When** they clear a required field or enter a malformed value, **Then** the save is refused, the offending field is flagged, and the stored record is left unchanged.
3. **Given** an administrator edits a student, **When** the change would make the student indistinguishable from an existing student, **Then** the save is refused with an explicit conflict message.
4. **Given** an administrator opens the edit view and makes no changes, **When** they save or cancel, **Then** the stored record is unaffected.

---

### User Story 4 - Remove a student (Priority: P4)

An administrator permanently removes a student who has left the school or was created in error, after an explicit confirmation.

**Why this priority**: Roster hygiene matters and the existing administrative workflows already assume the ability to remove accounts, but it is the least frequent action and the most destructive, so it follows the additive stories.

**Independent Test**: With a student that has related records (guardian/teacher links, assignments or progress), remove that student, confirm the removal is confirmed first, and confirm the roster no longer lists them while the rest of the platform keeps working. Testable with only enrolment and the roster list present.

**Acceptance Scenarios**:

1. **Given** a student exists, **When** the administrator requests removal, **Then** they are first asked to confirm and nothing is removed until they do.
2. **Given** the administrator confirms removal, **When** the removal completes, **Then** the student no longer appears in the roster, searches, or class filters.
3. **Given** a student is linked to guardians or teachers or holds assignments, progress, or grades, **When** the student is removed, **Then** related records are resolved consistently so no other part of the platform is left showing an unknown student.
4. **Given** the administrator cancels the confirmation, **When** they return to the roster, **Then** the student is untouched.
5. **Given** an administrator is not signed in as an administrator, **When** they attempt to remove a student, **Then** the removal is refused and the record is untouched.

---

### User Story 5 - Manage the roster on a phone (Priority: P5)

An administrator adds, finds, corrects, and removes students from a phone or tablet in the same way they would from a desktop, in their own language.

**Why this priority**: Administrators at small schools work from phones and the platform's audience is mobile-first, so a desktop-only roster would be unusable in practice. It refines the earlier stories rather than adding new capability, so it is prioritized last.

**Independent Test**: Perform one enrolment, one search, one correction, and one removal on a narrow viewport and confirm every control is reachable and every action succeeds — using the same steps as on desktop.

**Acceptance Scenarios**:

1. **Given** an administrator uses a narrow viewport, **When** they use the roster, **Then** no control is clipped, overlapped, or requires horizontal scrolling, and the primary action stays reachable without zooming.
2. **Given** the administrator selects Cambodian or Arabic, **When** the roster and its forms render, **Then** all labels, messages, and validation feedback appear in that language, and the Arabic presentation mirrors correctly for right-to-left reading.
3. **Given** the administrator prefers a keyboard or assistive technology, **When** they move through the roster and forms, **Then** every field, button, and message is reachable and announced with an understandable label.

---

### Edge Cases

- **Whitespace and casing variants in search**: a name typed as `" Sophea "` or `"SOPHEA"` must be found by the same name search, so casing and padding never hide a student from the administrator. The same applies when searching by sign-in identity (Clarification Q7).
- **Two students sharing a display name**: because uniqueness keys on sign-in identity (Q2), two different children may both be named `"Sophea"`. Both must enrol successfully and both must remain individually selectable for edit and removal rather than being confused for one another.
- **Simultaneous entry**: two administrators register the same child at the same moment; the platform must reject the second attempt rather than storing two records.
- **Removed student with history**: removing a student who has guardian/teacher links, assignments, progress, or grades must not leave those areas broken, pointing at an unknown student, or silently deleting more than the administrator expects.
- **Year level confused with grades**: because the platform uses "grade" for two different things, the roster must never display a student's year level where a graded mark is expected, or vice versa; year level is an enrolment attribute while grades are earned marks (Clarification Q4).
- **Class emptied by removal**: removing the only student in a class leaves the class filter with no matches; the filter must present a clear empty result rather than an error.
- **Deactivated student must not be mistaken for a present one**: the roster must distinguish a deactivated student (record intact, sign-in blocked) from an active one, and deactivation must never be presented as, or silently upgraded into, permanent removal (Clarification Q5, FR-032).
- **Roster larger than one screen**: paging or progressive loading must not hide matching students from a search, and the "no matches" message must be distinguishable from "still loading".
- **Partial network failure**: a save the platform cannot confirm must not leave the administrator believing the change was stored.
- **Confirmation must not under-state permanence**: the removal prompt is the only safeguard on an irreversible action (Q3), so it must name the student *and* say the removal is permanent with links, assignments, progress, and grades unrecoverable; a prompt that merely mentions deleting "their links" is insufficient (Clarification Q8, FR-019).
- **Incomplete form abandoned**: navigating away from a half-filled form must not silently enroll a partial record.
- **Very long or non-Latin input**: names, addresses, and notes containing Khmer or Arabic characters, or long unbroken strings, must not be truncated silently or break the layout.
- **Credential handling**: a newly enrolled student must end up with exactly one usable sign-in credential, and re-editing the record must not invalidate or duplicate it unexpectedly. The credential may be administrator-supplied or auto-generated, and a blank value on the form means "generate one" rather than "no credential" (Clarification Q6, FR-010).
- **Unauthorized or expired session**: an administrator whose session expires mid-task must get an explicit re-authentication prompt rather than a silently discarded edit.

## Requirements *(mandatory)*

### Functional Requirements

**Access & scope**

- **FR-001**: Only administrators MUST be able to register, view, edit, search, filter, and remove students. Every other role MUST be refused, and the refusal MUST be enforced regardless of what the interface shows.
- **FR-002**: The module MUST scope all student data to the platform's existing student role rather than introducing a separate, parallel notion of "student". Existing accounts that are already students MUST remain visible and manageable in the new roster.
- **FR-003**: The module MUST operate on the same student records the rest of the platform uses, so that links to guardians and teachers, assignments, progress, and grades continue to resolve after a student is added, edited, or removed.

**Registration (FR-004 – FR-010)**

- **FR-004**: Administrators MUST be able to register a new student by supplying the child's identifying details, year level, and class placement. Both year level and class placement MUST be recorded as values on the student record; no separate class- or year-level-maintenance step may be required to register or edit a student. Year level MUST remain distinct from the graded marks a student earns on assignments and quizzes.
- **FR-005**: The module MUST define an explicit set of required fields, and MUST refuse to register a student while any required field is empty, whitespace-only, or of an invalid format.
- **FR-006**: The module MUST reject a registration attempt that would duplicate an existing student's sign-in identity, and MUST name that conflicting field specifically so the administrator can act on it.
- **FR-007**: Duplicate detection MUST be insensitive to leading/trailing whitespace and letter casing, so formatting differences alone do not create a second roster entry.
- **FR-008**: Duplicate detection MUST hold even when two registrations for the same child arrive at the same time; at most one record may be created.
- **FR-009**: Validation feedback MUST identify each offending field individually and MUST preserve the administrator's other entered values so the form does not have to be refilled.
- **FR-010**: Every newly registered student MUST receive exactly one usable sign-in credential appropriate to a child account, without the administrator having to manage credentials by hand. The administrator MAY supply the credential during enrolment; when it is left blank, the platform MUST generate one automatically. Exactly one credential MUST be active for the child either way.

**Editing (FR-011 – FR-013)**

- **FR-011**: Administrators MUST be able to edit an existing student's information, including correcting the year level and moving the student to a different class.
- **FR-012**: Edits MUST be subject to the same required-field and duplicate rules as registration (FR-005 – FR-008).
- **FR-013**: A refused edit MUST leave the stored record exactly as it was before the attempt.

**Viewing, search, and filter (FR-014 – FR-018)**

- **FR-014**: Administrators MUST be able to view the complete roster of students.
- **FR-015**: The roster MUST show, at minimum, each student's name, class, and year level.
- **FR-016**: Administrators MUST be able to search students by name using a partial, case-insensitive match. The same search MUST also match a student's sign-in identity, so the roster's existing convenience of finding a child by either name or sign-in identity is preserved (Clarification Q7); matching either field MUST be sufficient to show the student.
- **FR-017**: Administrators MUST be able to filter students by class, and search and class filter MUST be combinable so that both conditions apply at once. The set of classes offered for filtering MUST be derived from the class values already present on student records.
- **FR-018**: The roster MUST clearly distinguish "no students match the current search or filter" from "the roster is still loading", and MUST allow the administrator to clear all search and filter criteria in a single action.

**Removal (FR-019 – FR-022)**

- **FR-019**: Administrators MUST be able to remove a student, but only after an explicit confirmation step. The confirmation MUST name the student being removed and MUST state plainly that the removal is permanent and that the student's links, assignments, progress, and grades cannot be recovered; the removal MUST NOT proceed unless the administrator affirmatively confirms it (Clarification Q8). Performance of the confirmation MUST remain the existing, familiar single-prompt interaction rather than a heavier new flow.
- **FR-020**: Removal MUST be permanent and MUST resolve the student's related records — guardian/teacher links, assignments, progress, and grades — atomically, so that either the student and every related record are removed together or nothing changes, and no other part of the platform is left broken or referencing a student that no longer exists.
- **FR-021**: A removed student MUST no longer appear in the roster, in name searches, or under any class filter.
- **FR-022**: The module MUST NOT remove any other student, account, or piece of content as a side effect of removing one student.

**Persistence (FR-023 – FR-024)**

- **FR-023**: Student information MUST be persisted durably in the platform's relational database so it survives application restarts and is visible to every authorized administrator.
- **FR-024**: Student data MUST be readable and editable only by authenticated administrators; it MUST NOT be exposed to any unauthenticated or public visitor.

> **Binding constraint (Clarification Q1, resolved)**: the platform's relational database is **PostgreSQL only**. No MySQL dependency, container, driver, or connection string may be introduced. FR-023 therefore resolves to PostgreSQL, and student fields are satisfied by the existing `users` table plus additive columns where required (FR-031).

**Interface & languages (FR-025 – FR-028)**

- **FR-025**: The module MUST provide a responsive administrative interface that supports registration, listing, searching, filtering, editing, and removal at both desktop and phone viewport sizes, without horizontal scrolling or unreachable controls.
- **FR-026**: The interface MUST be provided in all three of the platform's supported languages (English, Cambodian, and Arabic), using the platform's existing translation catalogues rather than hardcoded text.
- **FR-027**: The interface MUST present correctly in right-to-left reading order for Arabic.
- **FR-028**: Every interactive control and validation message MUST be operable and understandable via keyboard and assistive technology, with an accessible name.

**Preservation (FR-029 – FR-031)**

- **FR-029**: The module MUST NOT change the behaviour of existing platform areas — authentication, the content library, the CMS, grading, teacher, parent, or student pages.
- **FR-030**: The module MUST follow the platform's existing administrative conventions for authentication, authorization failure responses, and error message structure, so client behaviour stays consistent.
- **FR-031**: Where the existing student data model lacks a needed attribute or relationship, the module MUST extend it additively — existing records MUST remain valid and MUST NOT require destructive migration.
- **FR-032**: The module MUST preserve the platform's existing distinction between **deactivating** and **removing** a student. Deactivation MUST remain available and MUST keep the student's record and history intact while preventing sign-in; permanent removal MUST remain the only operation that destroys the record. The two MUST NOT be presented as the same action.

### Key Entities *(include if feature involves data)*

- **Student**: A child enrolled on the platform, represented as an account carrying the platform's `student` role. Key attributes: display name, sign-in identity used for uniqueness, year level, class placement, preferred language, active status, and the sign-in credential used by the child. Related to guardians and teachers, and the subject of assignments, progress, and grades. Year level (the child's academic stage) is distinct from grades (the marks earned on assignments and quizzes).
- **Class placement**: The grouping a student belongs to, used to organize the roster and to power the class filter. Per Clarification Q2, class is carried as a **value on the student record**; the filter's available classes are derived from the values present. Per Clarification Q4, **year level** is carried as a companion value on the same record, so a class belongs to a year level and the two are stored, validated, and displayed independently. Neither is a managed entity; promoting either to dedicated records remains a possible future feature.
- **Guardian/teacher link**: The existing associations connecting a student to the parents and teachers responsible for them. Removal of a student must resolve these without orphaning anything.
- **Validation** *(not a stored entity — a rule set)*: The agreed set of required fields, format rules, and uniqueness rules applied identically on registration and on edit.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: An administrator can register a new student in under 60 seconds from opening the roster, including time spent entering every required field.
- **SC-002**: 100% of registration attempts missing a required field, or duplicating an existing student, are refused — no incomplete or duplicate student record is ever stored.
- **SC-003**: An administrator can locate a specific student by name in a roster of 500 students in under 10 seconds, without scrolling through the full list.
- **SC-004**: Searching by name and filtering by class return results that satisfy both criteria simultaneously, with zero students outside the selected class appearing in the filtered results.
- **SC-005**: Every one of the four core actions — register, find, correct, remove — is completable on a 360-pixel-wide viewport with no horizontal scrolling and no unreachable control.
- **SC-006**: 100% of the roster's labels, validation messages, and empty states render in all three supported languages, with Arabic presented in correct right-to-left order.
- **SC-007**: Zero regressions in existing platform behaviour: the areas that work today continue to work identically after the module ships.
- **SC-008**: Removing a student leaves no unrelated area of the platform broken — measured as zero errors in list, progress, grading, or parent views that previously included that student.
- **SC-009**: 90% of administrators successfully complete a first-time student registration without assistance or a second attempt.

## Assumptions

- **Datastore is PostgreSQL (Clarification Q1, resolved)**: the feature request named MySQL, but the platform's stack is PostgreSQL — `README.md` lists it under "Key decisions (do not change without asking)", `docker-compose.yml` uses `postgres:15-alpine`, `backend/requirements.txt` pins `psycopg2-binary`, and `config.py`/`.env.example` default to `postgresql+psycopg2://`. You confirmed **PostgreSQL only**. Student information is therefore persisted in the existing PostgreSQL database and no MySQL migration is undertaken. The requirement "store student information in MySQL" is recorded as satisfied by PostgreSQL. FR-023 is written technology-agnostically and binds to PostgreSQL via the constraint note above it.
- **Scope is additive extension, not a rebuild**: the platform already has an administrative account-management area covering all four roles, and student records already exist there. This module extends that area with a student-focused roster (search, class filter, dedicated enrolment flow) rather than replacing or duplicating it. Preserving existing behaviour (FR-029) takes precedence over any redesign.
- **Admins are the only audience for this module**: consistent with the platform's model where "the Admin controls everything" and no public sign-up exists. Teachers, parents, and students must not gain roster management through this feature.
- **Class placement and year level are values on the student (Clarification Q2, Q4, resolved)**: you confirmed the existing representation is kept, so class and year level remain values on the student record rather than managed entities. This satisfies the filter requirement (FR-017, SC-004) and the roster display requirement (FR-015), and requires no migration of existing class or grade values. The accepted trade-off is that free-text class and year-level values can be typed inconsistently; deriving the filter options from values already present keeps the filter faithful to real data.
- **Uniqueness is enforced on sign-in identity, not on the display name (Clarification Q2, resolved)**: you confirmed duplicates are judged by the student's sign-in identity — the same attribute the platform already enforces uniqueness on. Display name alone is deliberately not a uniqueness key, so two children with the same name may both be enrolled (FR-006); comparison is case- and whitespace-insensitive (FR-007) and safe under concurrent attempts (FR-008).
- **Required fields follow the existing model**: the platform's user record already treats name and sign-in identity as non-null. The required-field set for enrolment is assumed to be at least display name, sign-in identity, year level, class placement, and preferred language, with validation mirrored on the client and server. Year level and class are separate required values (Clarification Q4).
- **Child-appropriate credentials (Clarification Q6, resolved)**: the platform supports child-friendly sign-in methods (personal identification number or picture) alongside passwords, and existing student accounts use them. Newly enrolled children use one of these methods (FR-010). You confirmed the credential is **not** a required field the administrator must type: the enrolment form offers it, and when it is left blank the platform generates one automatically, so the child always ends up with exactly one usable credential and the administrator is never forced to invent or track one.
- **Existing authentication and authorization are reused unchanged**: administrators authenticate through the platform's current mechanism, and the module reuses the existing administrative-only access convention rather than inventing a new one.
- **Removal is permanently destructive (Clarification Q3, resolved)**: you accepted the default. Removing a student deletes the account and its related records, so progress, grades, and link history are **unrecoverable**. Permanent removal is kept distinct from **deactivation**, which continues to exist and preserves the record (Clarification Q5, FR-032); the module introduces no *new* soft-delete or reactivation flow. The mandatory confirmation step (FR-019) is therefore the only safeguard on the destructive path and must not be bypassed. Note that the existing delete path is currently **broken for students who have link rows** — `student_parent`/`teacher_student` carry foreign keys to `users.id` with no cascade or `ondelete` rule, so the delete raises a foreign-key violation instead of succeeding. Adding the required ordered cleanup is an additive fix (FR-031).
- **Audit logging is expected to remain intact**: the platform keeps an audit log for accountability, so permanent removal is assumed to be recorded there rather than silently discarding the fact of the removal.
- **Database migration is acceptable, data loss is not**: schema additions may be needed, and an additive migration is expected. Existing student records must remain valid (FR-031).
- **Pagination is deferred**: at the roster sizes this module targets, loading the full list and filtering in the client is acceptable. If the roster approaches thousands of students, server-side paging and search become a follow-up.
- **Platform test conventions apply**: the platform already has both backend and frontend test tooling in place (including a mock-backed client used in tests), and this feature is expected to be covered with the same tooling.

## Clarifications

### Resolved

#### Q1 — Database engine: **PostgreSQL only** ✅ *(resolved 2026-11-09)*

**Decision**: Student information is stored in the platform's **existing PostgreSQL database**. There is no MySQL migration. The original request's "Store student information in MySQL" is recorded as satisfied by PostgreSQL.

**Evidence**: `README.md` lists PostgreSQL under a section titled "Key decisions (do not change without asking)" (`| Database | PostgreSQL |`) and its architecture diagram routes the API to PostgreSQL; `docker-compose.yml` provisions `image: postgres:15-alpine` with `DATABASE_URL: postgresql+psycopg2://…`; `backend/requirements.txt` pins `psycopg2-binary==2.9.9`; and `backend/app/config.py` plus `.env.example` default to `postgresql+psycopg2://…`. No MySQL driver, container, or configuration exists anywhere in the project.

**Note on file location**: `README.md` is absent from the current working tree (it was deleted in an unrelated, pre-existing change) but is present at `HEAD`. The evidence above was read from `git show HEAD:README.md`. `docs/04-architecture-and-database.md`, also cited during analysis, is likewise deleted from the working tree.

**Consequences**:
- No infrastructure, driver, or connection-string changes; existing models, migrations, and queries are untouched.
- FR-023 (durable persistence in the platform's relational database) resolves to PostgreSQL.
- The persisted-field requirement is satisfied by the existing `users` table plus additive columns if needed (FR-031).
- MySQL remains explicitly out of scope for this feature and for the platform.

#### Q2 — Uniqueness rule and class representation: **Option A** ✅ *(resolved 2026-11-09)*

**Decision**: Duplicate detection is based on the student's **sign-in identity** (the same identity the platform already enforces uniqueness on), and **class remains a value stored on the student record** rather than becoming a managed class entity.

**Consequences**:
- **Duplicate rule**: two registration attempts that resolve to the same sign-in identity are one student. Display name alone is *not* a uniqueness key, so two children who share a name may both be enrolled (FR-006). Comparison ignores leading/trailing whitespace and letter casing (FR-007) and holds under concurrent attempts (FR-008).
- **Class representation**: class stays as the existing value on the student, satisfying the filter requirement (FR-017) and the roster display requirement (FR-015). No `classes`/`class_members` entities, no class-maintenance surface, and no data migration for existing records (FR-031).
- **Accepted trade-off**: because class is free text, the same class may be typed inconsistently over time, which degrades filter accuracy. The filter set is therefore derived from the values already present so it always reflects real data.
- **Reversible later**: promoting class to managed records remains possible as a separate future feature without invalidating this module's behaviour.

#### Q3 — Removal semantics: **Option A (default accepted)** ✅ *(resolved 2026-11-09)*

**Decision**: Removal **permanently deletes** the student and resolves their related records. No soft-delete or deactivation is introduced by this feature — permanent removal and deactivation remain two distinct operations, and the pre-existing deactivation control is left intact (Q5).

**Evidence of current behaviour**: `backend/app/blueprints/users.py` deletes the target with `db.session.delete(target)` and returns `{"ok": True}`; the administrative interface warns that removal "also removes their links".

**Consequences**:
- The student and their related records (guardian/teacher links, assignments, progress, grades) are removed permanently; historical progress and grade data is **unrecoverable**.
- Removal stays irreversible, so the explicit confirmation step (FR-019) is the sole safeguard and must remain mandatory.
- The removal is **permanent**, so it is deliberately *not* the same as — and must not be confused with — **deactivating** a student. Deactivation preserves the record and its history while blocking sign-in; removal destroys it. The existing activate/deactivate toggle is therefore retained unchanged (see Q5).
- No reactivation flow for removed students, and no uniqueness exemption, is needed — removal frees the sign-in identity for reuse (Q2).
- The removal must be **atomic**: either the student and every related record are removed together, or nothing changes.

**⚠️ Required correction to existing behaviour**: the current delete path cannot satisfy FR-020 as written. `student_parent` and `teacher_student` (see `backend/app/models/link.py`) declare foreign keys to `users.id` with **no `ondelete` rule** and **no ORM relationship/cascade** on the user model, and the initial migration defines none either. Deleting a user that still has link rows will therefore raise a foreign-key violation rather than succeeding. The module must add an explicit, ordered cleanup of dependent rows inside the same transaction so FR-020 and SC-008 hold. This is an additive fix, not a schema rewrite (FR-031).

#### Q4 — Year level alongside class: **Option A** ✅ *(resolved 2026-11-09)*

**Decision**: A student's record carries a **year level** *in addition to* a class placement. Both are stored as values on the student record, and **year level is distinct from graded marks** — "grade" as a year level (e.g. "Grade 1") never means the scores a student earns on assignments and quizzes. The terminology collision is resolved by always writing **"year level"** for the academic stage and **"grades"** for marks.

**Evidence**: the existing administrative form already collects both — `frontend/src/pages/admin/Users.jsx` renders a *Grade* field (`placeholder="Grade 1"`, line ~343) alongside a *Class* field (~line 354), and displays them together as `{user.grade || "Grade 1"} · {user.class_name || "1A"}` (~line 218). The seeded/sample student records in `frontend/src/data/users.json` likewise carry both `"grade": "Grade 1"` and `"class_name": "1A"`. However, the durable `users` table in `backend/app/models/user.py` and the initial migration define **neither** column, so today both values exist only in the sample data and the mock. The original feature request named only "class".

**Consequences**:
- **Two attributes, not one**: year level and class are captured, validated, stored, and displayed independently (FR-004, FR-011, FR-015). A class belongs to a year level; the two are never collapsed into a single field.
- **Roster and form match existing behaviour**: the roster shows both (FR-015) and the enrolment/edit form offers both, so FR-029 preservation holds and the sample data stays meaningful.
- **Persistence is additive**: the existing `users` table gains the needed columns through an additive migration (FR-031, FR-023); existing records remain valid and no destructive migration is required.
- **No new managed entity**: like class (Q2), year level remains a plain value rather than a maintainable lookup; promoting either to dedicated records stays a possible future feature.
- **Uniqueness is unaffected**: neither year level nor class participates in duplicate detection, which continues to key on sign-in identity (Q2, FR-006).
- **Filter scope unchanged**: only class drives the roster filter (FR-017); year level is displayed and editable, and may also be filtered later without invalidating this decision.

#### Q5 — Deactivation vs. permanent removal: **Option A** ✅ *(resolved 2026-11-09)*

**Decision**: The roster **keeps the platform's existing activate/deactivate capability unchanged**. Deactivation is retained as a distinct, non-destructive operation that preserves the student's record and history while blocking sign-in, and is deliberately **not** merged with permanent removal. The earlier Q3 wording claiming no active flag was needed is corrected here.

**Evidence**: the administrative interface already provides this behaviour — `frontend/src/pages/admin/Users.jsx` renders an active/inactive indicator (`user.is_active ? "Active" : "Inactive"`, ~line 207), a **Deactivate**/**Activate** toggle (`toggleActive`, ~lines 104, 230–233), and an "Account is active" checkbox on the form (~line 408). The backend supports it: `backend/app/blueprints/users.py` accepts `is_active` in the update field list (line 68), and `backend/app/blueprints/auth.py` refuses sign-in for a deactivated account (`if not user or not user.is_active`, lines 16 and 63). The `users` table already carries `is_active`. Dropping it would regress working behaviour, contradicting FR-029.

**Consequences**:
- **Two distinct operations, clearly labelled**: deactivate = reversible, keeps the record, blocks sign-in; remove = permanent, destroys the record and its history (Q3). The interface MUST NOT present them as the same action (FR-032).
- **No regression**: the existing toggle, status indicator, and form control are preserved as-is (FR-029, FR-003).
- **No new filtering requirement**: today's roster lists all accounts and toggles their state; surfacing inactive students as a separate view is *not* required by this feature and remains a possible future improvement.
- **Uniqueness unaffected**: a deactivated student keeps its record and therefore its sign-in identity, so duplicate detection (Q2, FR-006) continues to reject a second attempt for that child while the account exists.
- **Deletion of a deactivated student** remains possible and still triggers the ordered cleanup described in Q3.

#### Q6 — Child credential provisioning: **Option A** ✅ *(resolved 2026-11-09)*

**Decision**: The existing credential behaviour is kept. The enrolment form **offers** the child's sign-in credential (a PIN), and the administrator **may** supply it. When it is left **blank**, the platform **generates** one automatically. Either way the child ends up with **exactly one** usable credential, and the credential is **not** a required field the administrator must fill in.

**Evidence**: `frontend/src/pages/admin/Users.jsx` renders a **Login PIN** input (~lines 361–364), the new-student form initialises `login_pin: ""` (line 18), and the form's only hard requirement is name and email (`if (!form.full_name.trim() || !form.email.trim())`, ~line 86) — so the PIN is optional. The mock honours this: `frontend/src/api/mock.js` assigns `user.login_pin = data.login_pin || String(Math.floor(1000 + Math.random() * 8999))` for students (~line 300) and forces `login_method: "pin"` for the student role (~line 291). The form copy states students "sign in with a PIN or picture — no typing required" (~line 286).

**Consequences**:
- **Credential is optional on the form, guaranteed on the record**: leaving the field blank is a request to generate, never a path to a credential-less account (FR-010).
- **No change to the required-field set (FR-005)**: the credential does not join the required fields; display name and sign-in identity remain the mandatory identity fields, alongside year level and class (Q4).
- **One credential, not two**: supplying a PIN must **replace** the generated one rather than storing both, so the "exactly one" guarantee holds.
- **Re-editing is safe**: editing other attributes must not silently regenerate or invalidate an existing credential; regeneration is only an explicit, deliberate action.
- **Child-appropriate methods preserved**: PIN or picture sign-in remains the pattern for students, consistent with existing accounts.

#### Q7 — Search scope: **Option A** ✅ *(resolved 2026-11-09)*

**Decision**: The roster's search box keeps matching **both the student's name and their sign-in identity**. Typing either a name fragment or part of a sign-in identity finds the student, so the more forgiving search that exists today is preserved rather than narrowed.

**Evidence**: `frontend/src/pages/admin/Users.jsx` filters on both fields — `user.full_name?.toLowerCase().includes(needle) || user.email?.toLowerCase().includes(needle)` (~lines 57–60) — and the search input's placeholder reads "Search by name or email..." (~line 179). FR-016 as originally written named only the name, which would have narrowed this working behaviour and risked FR-029.

**Consequences**:
- **Requirement widened to match reality**: FR-016 now states name matching *and* sign-in-identity matching, so the spec no longer under-describes the existing search.
- **No regression (FR-029)**: the placeholder and matching behaviour stay as they are; the module simply preserves them.
- **Either field suffices**: a match on name alone or sign-in identity alone shows the student; there is no requirement for both to match.
- **Combines with the class filter unchanged**: the search predicate is ANDed with the class filter (FR-017) exactly as today.
- **Case- and whitespace-insensitive** on both fields, consistent with the search edge case and Q2's duplicate-detection rule.

#### Q8 — Removal confirmation honesty: **Option A** ✅ *(resolved 2026-11-09)*

**Decision**: The confirmation step keeps its **existing single-prompt interaction** (the administrator is asked once and nothing is removed until they agree), but the prompt's wording is **corrected to be honest about consequences**: it names the student and states plainly that the removal is **permanent** and that the student's links, assignments, progress, and grades **cannot be recovered**.

**Evidence**: the current prompt is `window.confirm("Delete <name>? This also removes their links.")` (`frontend/src/pages/admin/Users.jsx:110`). It names the student and the links, but never states that the action is **permanent** or that history is **unrecoverable** — even though Q3 established that permanent removal destroys the record and its history and that this confirmation is the **sole safeguard** on the destructive path (FR-019, FR-020). The prompt therefore currently under-states what it is confirming.

**Consequences**:
- **FR-019 strengthened**: the confirmation MUST name the student, MUST state the removal is permanent, and MUST state that related records cannot be recovered, all before anything is removed.
- **Mechanism preserved, wording corrected**: the familiar one-step confirmation is retained (no new multi-step flow), so administrators see no new friction and no existing behaviour regresses (FR-029).
- **Consistent with Q3 and Q5**: permanence is what separates removal from deactivation; the corrected wording is what keeps that distinction visible at the moment of decision (FR-032).
- **Cancel remains safe**: cancelling leaves the student and all related records completely untouched (US4 scenario 4).
- **Slide to the eventual real UI**: when the mock data layer is replaced by the Flask API, the same wording requirement applies to whatever confirmation the surface uses.

### Open

_None._ All decisions raised during specification are resolved above; no open questions remain.

