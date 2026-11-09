import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  mockAssignments,
  mockAuth,
  mockGrading,
  mockProgress,
  mockUsers,
  resetMockDatabase,
} from "./mock";

const LINKS_KEY = "links";
const DB_KEY = "ll_mock_db_v2";

const baseStudent = (overrides = {}) => ({
  full_name: "New Learner",
  email: "new.learner@littlelearner.example",
  role: "student",
  year_level: "Grade 1",
  class_name: "1A",
  ...overrides,
});

beforeEach(() => {
  resetMockDatabase();
  localStorage.removeItem(LINKS_KEY);
  localStorage.removeItem("token");
  localStorage.removeItem("user");
});

afterEach(() => {
  localStorage.removeItem(LINKS_KEY);
  localStorage.removeItem("token");
  localStorage.removeItem("user");
});

describe("student management > create (US1, FR-001 - FR-011)", () => {
  it("enrols a complete student with a pin credential", async () => {
    const res = await mockUsers.create(baseStudent());

    expect(res.data.id).toBeTruthy();
    expect(res.data.role).toBe("student");
    expect(res.data.login_method).toBe("pin");
    expect(res.data.full_name).toBe("New Learner");
    expect(res.data.year_level).toBe("Grade 1");
    expect(res.data.class_name).toBe("1A");
  });

  it("generates a pin when the credential is left blank", async () => {
    const created = await mockUsers.create(baseStudent({ login_pin: "" }));
    const stored = await mockUsers.get(created.data.id);

    expect(stored.data.login_method).toBe("pin");
    // The credential is never returned by the API, so prove it exists by using it.
    const raw = JSON.parse(localStorage.getItem(DB_KEY));
    const pin = raw.users.users.find((user) => user.id === created.data.id).login_pin;
    expect(pin).toMatch(/^\d{4}$/);
  });

  it("generates a pin when the credential is omitted entirely", async () => {
    const created = await mockUsers.create(baseStudent({ email: "no.pin@littlelearner.example" }));

    const raw = JSON.parse(localStorage.getItem(DB_KEY));
    const pin = raw.users.users.find((user) => user.id === created.data.id).login_pin;
    expect(pin).toMatch(/^\d{4}$/);
  });

  it("lets the new student sign in with the generated pin", async () => {
    const created = await mockUsers.create(baseStudent({ email: "signin@littlelearner.example" }));

    const raw = JSON.parse(localStorage.getItem(DB_KEY));
    const pin = raw.users.users.find((user) => user.id === created.data.id).login_pin;

    const session = await mockAuth.tokenLogin({ token: pin });
    expect(session.data.user.id).toBe(created.data.id);
    expect(session.data.user.role).toBe("student");
  });

  it("keeps a supplied pin instead of overwriting it", async () => {
    const created = await mockUsers.create(baseStudent({ login_pin: "4321" }));

    const raw = JSON.parse(localStorage.getItem(DB_KEY));
    const pin = raw.users.users.find((user) => user.id === created.data.id).login_pin;
    expect(pin).toBe("4321");
  });

  it("never returns the credential from the create response", async () => {
    const created = await mockUsers.create(baseStudent({ login_pin: "4321" }));

    expect(created.data.login_pin).toBeUndefined();
  });

  it.each([
    ["full_name", { full_name: "   " }],
    ["email", { email: "" }],
    ["year_level", { year_level: "" }],
    ["class_name", { class_name: "" }],
  ])("rejects a missing %s with a message on that field only", async (field, override) => {
    await expect(mockUsers.create(baseStudent(override))).rejects.toMatchObject({
      response: {
        status: 400,
        data: { error: { code: "validation_error", fields: { [field]: expect.any(String) } } },
      },
    });
  });

  it("names only the offending field when one is missing", async () => {
    let caught = null;
    try {
      await mockUsers.create(baseStudent({ full_name: "", class_name: "1A" }));
    } catch (err) {
      caught = err;
    }

    const fields = caught?.response?.data?.error?.fields || {};
    expect(Object.keys(fields)).toEqual(["full_name"]);
  });

  it("rejects a malformed sign-in identity", async () => {
    await expect(
      mockUsers.create(baseStudent({ email: "not-an-email" }))
    ).rejects.toMatchObject({
      response: { status: 400, data: { error: { fields: { email: expect.any(String) } } } },
    });
  });

  it("rejects a duplicate sign-in identity", async () => {
    await expect(
      mockUsers.create(baseStudent({ email: "student1@littlelearner.example" }))
    ).rejects.toMatchObject({
      response: { status: 409, data: { error: { code: "exists" } } },
    });
  });

  it.each([
    ["different casing", "  STUDENT1@LittleLearner.Example  "],
    ["surrounding whitespace", "   student1@littlelearner.example   "],
  ])("still rejects a duplicate with %s", async (_label, email) => {
    await expect(mockUsers.create(baseStudent({ email }))).rejects.toMatchObject({
      response: { status: 409 },
    });
  });

  it("accepts the legacy grade key as the year level", async () => {
    const res = await mockUsers.create(
      baseStudent({ email: "legacy@littlelearner.example", year_level: undefined, grade: "Grade 3" })
    );

    expect(res.data.year_level).toBe("Grade 3");
    expect(res.data.grade).toBe("Grade 3");
  });
});


describe("student management > update (US3, FR-011 - FR-013)", () => {
  it("corrects the student's details", async () => {
    const res = await mockUsers.update("u3", {
      full_name: "Sophal Renamed",
      year_level: "Grade 4",
      class_name: "4B",
    });

    expect(res.data.full_name).toBe("Sophal Renamed");
    expect(res.data.year_level).toBe("Grade 4");
    expect(res.data.class_name).toBe("4B");
  });

  it("moves the student to another class and keeps it on read-back", async () => {
    await mockUsers.update("u3", { class_name: "4B" });
    const stored = await mockUsers.get("u3");

    expect(stored.data.class_name).toBe("4B");
    expect(stored.data.year_level).toBe("Grade 1");
  });

  it("keeps the legacy grade key in step with the year level", async () => {
    await mockUsers.update("u3", { year_level: "Grade 4" });
    const stored = await mockUsers.get("u3");

    expect(stored.data.year_level).toBe("Grade 4");
    expect(stored.data.grade).toBe("Grade 4");
  });

  it("refuses to move a student onto another student's identity", async () => {
    await expect(mockUsers.update("u3", { email: "student2@littlelearner.example" })).rejects.toMatchObject(
      { response: { status: 409, data: { error: { code: "exists" } } } }
    );
  });

  it("refuses an identity clash that differs only in casing", async () => {
    await expect(mockUsers.update("u3", { email: "STUDENT2@littlelearner.example" })).rejects.toMatchObject(
      { response: { status: 409 } }
    );
  });

  it("allows a student to keep their own identity", async () => {
    const res = await mockUsers.update("u3", { email: "student1@littlelearner.example" });

    expect(res.data.email).toBe("student1@littlelearner.example");
  });

  it("allows a casing-only change to a student's own identity", async () => {
    const res = await mockUsers.update("u3", { email: "Student1@LittleLearner.Example" });

    expect(res.data.email).toBe("Student1@LittleLearner.Example");
  });

  it.each([
    ["full_name", { full_name: "  " }],
    ["email", { email: "" }],
    ["class_name", { class_name: "" }],
    ["year_level", { year_level: "" }],
  ])("rejects an edit that clears %s", async (field, override) => {
    await expect(mockUsers.update("u3", override)).rejects.toMatchObject({
      response: { status: 400, data: { error: { fields: { [field]: expect.any(String) } } } },
    });
  });

  it("leaves the stored record untouched when an edit is refused", async () => {
    const before = await mockUsers.get("u3");

    await expect(
      mockUsers.update("u3", { full_name: "Should Not Save", class_name: "" })
    ).rejects.toMatchObject({ response: { status: 400 } });

    const after = await mockUsers.get("u3");
    expect(after.data).toEqual(before.data);
  });

  it("leaves the stored record untouched when a duplicate is refused", async () => {
    const before = await mockUsers.get("u3");

    await expect(
      mockUsers.update("u3", { email: "student2@littlelearner.example" })
    ).rejects.toMatchObject({ response: { status: 409 } });

    const after = await mockUsers.get("u3");
    expect(after.data.email).toBe(before.data.email);
  });

  it("leaves non-student edits alone", async () => {
    const res = await mockUsers.update("u2", { is_active: false });

    expect(res.data.is_active).toBe(false);
  });
});

describe("student management > students roster (US2, FR-014 - FR-018)", () => {
  it("returns only student accounts", async () => {
    const res = await mockUsers.students();

    expect(res.data.students.length).toBeGreaterThan(0);
    expect(res.data.students.every((user) => user.role === "student")).toBe(true);
  });

  it("shows each student's name, class and year level", async () => {
    const res = await mockUsers.students();
    const student = res.data.students.find((user) => user.id === "u3");

    expect(student.full_name).toBeTruthy();
    expect(student.class_name).toBeTruthy();
    expect(student.year_level || student.grade).toBeTruthy();
  });

  it("derives a sorted, de-duplicated class list", async () => {
    const res = await mockUsers.students();
    const sorted = [...res.data.classes].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

    expect(res.data.classes).toEqual(sorted);
    expect(new Set(res.data.classes).size).toBe(res.data.classes.length);
    expect(res.data.classes).toContain("1A");
  });

  it("finds a student by a partial name", async () => {
    const res = await mockUsers.students({ search: "soph" });

    expect(res.data.students.map((user) => user.full_name)).toContain("Sophal");
  });

  it("finds a student by their sign-in identity", async () => {
    const res = await mockUsers.students({ search: "student2@" });

    expect(res.data.students.map((user) => user.full_name)).toContain("Sophea");
  });

  it.each([
    ["surrounding whitespace", "  sophal  "],
    ["upper case", "SOPHAL"],
  ])("matches a search with %s", async (_label, search) => {
    const res = await mockUsers.students({ search });

    expect(res.data.students.map((user) => user.full_name)).toContain("Sophal");
  });

  it("filters by class", async () => {
    const res = await mockUsers.students({ class_name: "1A" });

    expect(res.data.students.length).toBeGreaterThan(0);
    expect(res.data.students.every((user) => user.class_name === "1A")).toBe(true);
  });

  it("narrows by search and class together", async () => {
    const classOnly = await mockUsers.students({ class_name: "1A" });
    const both = await mockUsers.students({ search: "s", class_name: "1A" });

    expect(both.data.students.every((user) => user.class_name === "1A")).toBe(true);
    expect(both.data.students.length).toBeLessThanOrEqual(classOnly.data.students.length);
  });

  it("returns an empty roster rather than rejecting when nothing matches", async () => {
    const res = await mockUsers.students({ search: "zzz-nobody-zzz" });

    expect(res.data.students).toEqual([]);
    expect(res.data.classes.length).toBeGreaterThan(0);
  });

  it("never exposes credential fields", async () => {
    const res = await mockUsers.students();

    expect(res.data.students.every((user) => user.login_pin === undefined)).toBe(true);
  });
});

describe("student management > remove (US4, FR-019 - FR-020, FR-032)", () => {
  it("removes a student who has links and learning records", async () => {
    const res = await mockUsers.remove("u3");

    expect(res.data).toEqual({ ok: true });
    const roster = await mockUsers.students();
    expect(roster.data.students.map((user) => user.id)).not.toContain("u3");
  });

  it("drops every link row that referenced the student", async () => {
    await mockUsers.remove("u3");

    const links = await mockUsers.links.list();
    const mentionsU3 = (link) => Object.values(link).includes("u3");

    expect(links.data.student_parent.some(mentionsU3)).toBe(false);
    expect(links.data.teacher_student.some(mentionsU3)).toBe(false);
  });

  it("mirrors the link cleanup into the standalone links key", async () => {
    await mockUsers.remove("u3");

    const stored = JSON.parse(localStorage.getItem(LINKS_KEY));
    expect(stored.student_parent.some((link) => link.student_id === "u3")).toBe(false);
    expect(stored.teacher_student.some((link) => link.student_id === "u3")).toBe(false);
  });

  it("leaves no assignment targets pointing at the student", async () => {
    await mockUsers.remove("u3");

    const assignments = await mockAssignments.list({ studentId: "u3" });
    expect(assignments.data).toEqual([]);
  });

  it("leaves no submission behind for the removed student's assignment", async () => {
    await mockUsers.remove("u3");

    const submissions = await mockGrading.submissions.list();
    expect(submissions.data.map((submission) => submission.id)).not.toContain("s1");
  });

  it("leaves no grade behind for the removed student's submission", async () => {
    await mockUsers.remove("u3");

    const grades = await mockGrading.grades.list();
    expect(grades.data.map((grade) => grade.id)).not.toContain("g1");
  });

  it("reports an empty progress view instead of erroring", async () => {
    await mockUsers.remove("u3");

    const progress = await mockProgress.student("u3");
    expect(progress.data.stats.total).toBe(0);
  });

  it("leaves other students and their links untouched", async () => {
    await mockUsers.remove("u3");

    const roster = await mockUsers.students();
    expect(roster.data.students.map((user) => user.id)).toEqual(["u5", "u8"]);

    const links = await mockUsers.links.list();
    expect(links.data.student_parent).toContainEqual({ student_id: "u5", parent_id: "u4" });
    expect(links.data.teacher_student).toContainEqual({ teacher_id: "u2", student_id: "u5" });
    expect(links.data.student_parent).toContainEqual({ student_id: "u8", parent_id: "u7" });
  });

  it("keeps the surviving student's own learning records", async () => {
    await mockUsers.remove("u3");

    const progress = await mockProgress.student("u5");
    expect(progress.data.student.id).toBe("u5");
  });

  it("removes a student who has no related rows without error", async () => {
    const created = await mockUsers.create(baseStudent({ email: "alone@littlelearner.example" }));
    const res = await mockUsers.remove(created.data.id);

    expect(res.data).toEqual({ ok: true });
  });

  it("reports success when the same student is removed twice", async () => {
    await mockUsers.remove("u3");
    const res = await mockUsers.remove("u3");

    expect(res.data).toEqual({ ok: true });
  });

  it("survives removal of a student who is also a parent elsewhere", async () => {
    // u4 is a parent, not a student, but the cleanup must not strand the roster
    // when the two roles ever coexist on one id.
    const res = await mockUsers.remove("u4");
    const roster = await mockUsers.students();

    expect(res.data).toEqual({ ok: true });
    expect(roster.data.students.map((user) => user.id)).toEqual(["u3", "u5", "u8"]);
  });

  it("drops the class from the filter once its last student is removed", async () => {
    await mockUsers.remove("u3");
    await mockUsers.remove("u8");
    const res = await mockUsers.students({ class_name: "1A" });

    expect(res.data.students).toEqual([]);
    expect(res.data.classes).not.toContain("1A");
  });
});

describe("student management > deactivation is not removal (FR-032)", () => {
  it("keeps a deactivated student on the roster", async () => {
    await mockUsers.update("u3", { is_active: false });
    const roster = await mockUsers.students();
    const student = roster.data.students.find((user) => user.id === "u3");

    expect(student).toBeTruthy();
    expect(student.is_active).toBe(false);
  });

  it("keeps a deactivated student's links and records intact", async () => {
    await mockUsers.update("u3", { is_active: false });

    const links = await mockUsers.links.list();
    expect(links.data.teacher_student.some((link) => link.student_id === "u3")).toBe(true);

    const progress = await mockProgress.student("u3");
    expect(progress.data.stats.total).toBeGreaterThan(0);
  });
});
