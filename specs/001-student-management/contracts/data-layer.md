# Contract: Frontend Data Layer — Student Management

**Consumer**: `frontend/src/pages/admin/Users.jsx` (and any future student surface) via `{ api } from "@/api/client"`.
**Provider**: `frontend/src/api/mock.js`, exported as `mockUsers` and re-exported as `api.users` on the default export.
**Convention**: every method is `async`, awaits an artificial `delay(...)`, and resolves `{ data: ... }`. Failures **reject** with the axios-shaped object `{ response: { status, data: { error: { code, message } } } }`, matching the existing suite expectations (e.g. `links.test.js`, `mock.test.js`).

## Existing methods (must keep working — FR-029)

| Method | Request | Resolves | Notes |
|--------|---------|----------|-------|
| `users.list()` | — | `{ data: User[] }` | All accounts, credential fields stripped by `plainUser` |
| `users.get(id)` | id | `{ data: User }` | Rejects `404` when unknown |
| `users.create(data)` | student payload | `{ data: User }` | See "create" below — now validates |
| `users.update(id, updates)` | partial payload | `{ data: User }` | Rejects `404` when unknown; now validates/conflicts |
| `users.remove(id)` | id | `{ data: { ok: true } }` | Now performs full ordered cleanup |
| `users.links.list()` | — | `{ data: { student_parent: [], teacher_student: [] } }` | Unchanged |
| `users.links.create(link)` | `{student_id,parent_id}` or `{teacher_id,student_id}` | `{ data: links }` | Unchanged shape (asserted by `links.test.js`) |
| `users.links.remove(link)` | `{student_id,parent_id,teacher_id}` | `{ data: links }` | Unchanged |

## New: `users.students(options)` — roster query (US2, FR-015 – FR-018)

| Aspect | Contract |
|--------|----------|
| Signature | `students({ search, class_name } = {})` |
| Filter | Only records with `role === "student"` (FR-018) |
| `search` | Case-insensitive, whitespace-tolerant substring match against `full_name` **OR** the sign-in identity `email` (FR-016, Q7). Blank/absent → no narrowing |
| `class_name` | Exact match on the student's class when a non-empty value is supplied; absent or `"all"` → no narrowing (FR-017) |
| Resolves | `{ data: { students: User[], classes: string[] } }` — `classes` is the derived, sorted, de-duplicated list of non-empty class values present in the roster (FR-017) |
| Empty result | `{ data: { students: [], classes: [...] } }` — an empty roster is a normal result, never a rejection (FR-014, edge case "class emptied by removal") |

## Behaviour changes to `create` / `update`

1. **Required-field validation** (FR-005, FR-009, FR-011): missing or malformed `full_name`, `email`, `year_level` (accepted from `year_level` or the legacy `grade` key), or `class_name` rejects with `400` and a per-field payload:
   ```js
   { response: { status: 400, data: { error: {
       code: "validation_error",
       message: "Please correct the highlighted fields.",
       fields: { email: "Email is required.", year_level: "Year level is required." }
   } } } }
   ```
2. **Duplicate rejection** (FR-006 – FR-008): a **different** user holding the same normalised (`trim().toLowerCase()`) `email` rejects with `409`:
   ```js
   { response: { status: 409, data: { error: {
       code: "exists", message: "That sign-in identity is already registered."
   } } } }
   ```
   On `update`, the record's own current value is not a conflict.
3. **Credential provisioning** (FR-010, Q6): `login_pin` remains optional. Blank → the mock generates a 4-digit PIN. Supplied → stored as-is. Exactly one credential results; `login_method` stays `"pin"` for students.
4. **Non-regression**: records created before this feature (which carry `grade`/`class_name` but no `year_level`) must still load and update.

## Behaviour change to `remove` (FR-019, FR-020, SC-008)

`remove(id)` must, in one synchronous block, then `persist()` **and** `persistLinks()` exactly once each:

1. stop the student appearing in `db.users.users` (roster, search, class filter — FR-020, SC-008, US4 scenario 2);
2. drop their rows from `db.users.links.student_parent` where either column matches, and from `db.users.links.teacher_student` where either column matches;
3. clear their `db.attempts`, `db.grades`, `db.submissions`, `db.assignments` (owned) and any `targets` entries referencing them — so no other surface shows an unknown student (US4 scenario 3);
4. leave every other user, link, and learning record untouched (US4 scenario 4).

The confirmation prompt itself is owned by the **UI contract**, not this layer (the component calls `remove` only after the administrator affirmatively confirms).

## UI contract (US4, FR-019, Q8)

`Users.jsx` `removeUser(user)` must present a single native confirmation that (a) names the student, (b) states the removal is **permanent**, and (c) states their links, assignments, progress, and grades **cannot be recovered**; it must call `api.users.remove(user.id)` only when the administrator confirms, and do nothing on cancel. This keeps the existing single-prompt interaction (Q8) while making the sole safeguard honest about consequences (Q3).
