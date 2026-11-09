import siteSettingsData from "../data/siteSettings.json";
import menusData from "../data/menus.json";
import footerData from "../data/footer.json";
import pagesData from "../data/pages.json";
import subjectsData from "../data/subjects.json";
import coursesData from "../data/courses.json";
import lessonsData from "../data/lessons.json";
import quizzesData from "../data/quizzes.json";
import questionsData from "../data/questions.json";
import usersData from "../data/users.json";
import assignmentsData from "../data/assignments.json";
import submissionsData from "../data/submissions.json";
import gradesData from "../data/grades.json";
import mediaData from "../data/media.json";

/*
 * Frontend-first data layer.
 *
 * Everything is seeded from the JSON files in src/data and kept in
 * localStorage so admin edits survive a page refresh. Swap this file for a
 * real HTTP client later — the component-facing API shape stays the same.
 */

const STORAGE_KEY = "ll_mock_db_v2";
const delay = (ms = 220) => new Promise((resolve) => setTimeout(resolve, ms));
const clone = (value) => JSON.parse(JSON.stringify(value));
const today = () => new Date().toISOString().slice(0, 10);

const defaults = {
  settings: clone(siteSettingsData),
  menus: clone(menusData),
  footer: clone(footerData),
  pages: clone(pagesData),
  subjects: clone(subjectsData),
  courses: clone(coursesData),
  lessons: clone(lessonsData),
  quizzes: clone(quizzesData),
  questions: clone(questionsData),
  users: clone(usersData),
  assignments: clone(assignmentsData),
  submissions: clone(submissionsData),
  grades: clone(gradesData),
  media: clone(mediaData),
  attempts: [],
};

function loadDb() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...clone(defaults), ...parsed };
    }
  } catch {
    // Corrupt storage — fall back to the seed data.
  }
  return clone(defaults);
}

let db = loadDb();

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch {
    // Storage can be unavailable in private mode; in-memory still works.
  }
}

function persistLinks() {
  try {
    localStorage.setItem("links", JSON.stringify(db.users.links));
  } catch {
    // Storage can be unavailable in private mode; in-memory still works.
  }
}

export function resetMockDatabase() {
  db = clone(defaults);
  persist();
}

const t = (field, lang = "en") => {
  if (!field) return "";
  if (typeof field === "string") return field;
  return field[lang] || field.en || "";
};

const find = (arr, id) => arr.find((item) => item.id === id);
const byPosition = (a, b) => (a.position ?? 999) - (b.position ?? 999);
const nextId = (prefix) => `${prefix}${Date.now()}${Math.floor(Math.random() * 90 + 10)}`;

const plainUser = (user) => {
  if (!user) return null;
  const { password_hash, login_token_hash, login_pin, ...safe } = user;
  return safe;
};

const findUser = (id) => plainUser(find(db.users.users, id));

const targetId = (assignment, studentId) => `${assignment.id}-${studentId}`;

const allTargets = () =>
  db.assignments.flatMap((assignment) =>
    (assignment.targets || []).map((target) => ({
      ...target,
      id: target.id || targetId(assignment, target.student_id),
      assignment_id: assignment.id,
      item_type: assignment.item_type,
      item_id: assignment.item_id,
      title: assignment.title,
      due_date: assignment.due_date,
      assigned_by: assignment.assigned_by,
    }))
  );

const findTarget = (id) => allTargets().find((target) => target.id === id);

const gradeForSubmission = (submissionId) =>
  db.grades.find((grade) => grade.submission_id === submissionId);

const scoreForTarget = (target) => {
  const submission = db.submissions.find((sub) => sub.target_id === target.id);
  if (submission) {
    const grade = gradeForSubmission(submission.id);
    if (grade) return grade.score;
  }
  const attempt = db.attempts.find(
    (item) => item.student_id === target.student_id && item.quiz_id === target.item_id
  );
  return attempt ? attempt.percentage : null;
};

const decorateTarget = (target) => {
  const score = scoreForTarget(target);
  const completed = ["completed", "graded", "submitted"].includes(target.status);
  return {
    ...target,
    score,
    is_overdue: !completed && target.due_date && target.due_date < today(),
  };
};

const studentSnapshot = (studentId) => {
  const student = find(db.users.users, studentId);
  const targets = allTargets()
    .filter((target) => target.student_id === studentId)
    .map(decorateTarget);
  const scores = targets.map((item) => item.score).filter((score) => score !== null);
  const completed = targets.filter((item) =>
    ["completed", "graded"].includes(item.status) || item.score !== null
  ).length;

  return {
    student: plainUser(student),
    items: targets,
    stats: {
      total: targets.length,
      completed,
      overdue: targets.filter((item) => item.is_overdue).length,
      avgScore: scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0,
      lessons: targets.filter((item) => item.item_type === "lesson").length,
    },
  };
};

// ===== Student management helpers =====
// Shared by create/update/remove so the roster rules live in one place.

// Sign-in identities (and search terms) compare case- and whitespace-insensitively.
const identityKey = (value) => String(value ?? "").trim().toLowerCase();

const text = (value) => String(value ?? "").trim();

const looksLikeEmail = (value) => {
  const raw = text(value);
  const at = raw.indexOf("@");
  if (at <= 0 || at !== raw.lastIndexOf("@")) return false;
  return raw.slice(at + 1).length > 0;
};

// "Year level" is stored as year_level; the legacy key is still read so records
// created before this feature keep loading and validating (FR-031).
const studentYearLevel = (data) => text(data?.year_level ?? data?.grade);

const validationError = (fields) => ({
  response: {
    status: 400,
    data: {
      error: {
        code: "validation_error",
        message: "Please correct the highlighted fields.",
        fields,
      },
    },
  },
});

const duplicateError = () => ({
  response: {
    status: 409,
    data: {
      error: {
        code: "exists",
        message: "That sign-in identity is already registered.",
      },
    },
  },
});

// Every violation is reported against its own field so the form can mark the
// exact input, leaving the other values the administrator typed untouched.
const validateStudentFields = (data, yearLevel) => {
  const fields = {};
  if (!text(data.full_name)) fields.full_name = "Name is required.";
  const email = text(data.email);
  if (!email) fields.email = "Sign-in identity is required.";
  else if (!looksLikeEmail(email)) fields.email = "Enter a valid email address.";
  if (!yearLevel) fields.year_level = "Year level is required.";
  if (!text(data.class_name)) fields.class_name = "Class is required.";
  return fields;
};

// A duplicate is judged on the normalised identity. On update the record's own
// current value is not a conflict with itself.
const assertUniqueIdentity = (email, excludeId = null) => {
  const key = identityKey(email);
  const clash = db.users.users.find(
    (user) => user.id !== excludeId && identityKey(user.email) === key
  );
  if (clash) throw duplicateError();
};

// Remove every row that hangs off the user id, then the user record itself, so
// no surface is left pointing at a student that no longer exists (FR-020).
const purgeDependentRecords = (id) => {
  db.users.links.student_parent = db.users.links.student_parent.filter(
    (link) => link.student_id !== id && link.parent_id !== id
  );
  db.users.links.teacher_student = db.users.links.teacher_student.filter(
    (link) => link.student_id !== id && link.teacher_id !== id
  );

  const removedTargetIds = new Set();
  db.assignments.forEach((assignment) => {
    assignment.targets = (assignment.targets || []).filter((target) => {
      if (target.student_id !== id) return true;
      removedTargetIds.add(target.id || targetId(assignment, target.student_id));
      return false;
    });
  });

  const removedSubmissionIds = new Set();
  db.submissions = db.submissions.filter((submission) => {
    if (submission.student_id === id || removedTargetIds.has(submission.target_id)) {
      removedSubmissionIds.add(submission.id);
      return false;
    }
    return true;
  });

  // Quiz attempts are keyed by student; their grades point back by attempt id.
  const removedAttemptIds = new Set(
    db.attempts.filter((attempt) => attempt.student_id === id).map((attempt) => attempt.id)
  );
  db.attempts = db.attempts.filter((attempt) => attempt.student_id !== id);

  db.grades = db.grades.filter(
    (grade) =>
      !removedSubmissionIds.has(grade.submission_id) &&
      !removedAttemptIds.has(grade.quiz_attempt_id) &&
      grade.student_id !== id &&
      grade.graded_by !== id
  );

  // Last: the account itself.
  db.users.users = db.users.users.filter((user) => user.id !== id);
};

// ===== Auth =====
export const mockAuth = {
  login: async ({ email, password }) => {
    await delay(350);
    const user = db.users.users.find(
      (item) => item.email?.toLowerCase() === String(email || "").toLowerCase()
    );
    // Prototype login: any non-empty password is accepted for active users.
    if (!user || !user.is_active || !password) {
      throw { response: { status: 401, data: { error: { code: "invalid_credentials", message: "Invalid email or password" } } } };
    }
    if (!user.password_hash) user.password_hash = "$2b$12$mock.hash";
    const token = `mock-jwt-token-${user.id}`;
    localStorage.setItem("token", token);
    const safe = plainUser(user);
    localStorage.setItem("user", JSON.stringify(safe));
    return { data: { token, user: safe } };
  },

  tokenLogin: async ({ token: loginToken }) => {
    await delay(350);
    const value = String(loginToken || "").trim();
    const user = db.users.users.find(
      (item) =>
        item.role === "student" &&
        item.is_active &&
        (item.login_pin === value ||
          item.login_token_hash === value ||
          item.id === value ||
          item.avatar === value)
    );
    if (!user) {
      throw { response: { status: 401, data: { error: { code: "invalid_token", message: "Invalid QR/PIN token" } } } };
    }
    const token = `mock-jwt-token-${user.id}`;
    localStorage.setItem("token", token);
    const safe = plainUser(user);
    localStorage.setItem("user", JSON.stringify(safe));
    return { data: { token, user: safe } };
  },

  me: async () => {
    await delay(120);
    const userStr = localStorage.getItem("user");
    if (!userStr) throw { response: { status: 401 } };
    return { data: JSON.parse(userStr) };
  },

  logout: async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return { data: { ok: true } };
  },
};

// ===== Public website =====
export const mockPublic = {
  site: async ({ lang = "en" } = {}) => {
    await delay(120);
    return { data: { settings: db.settings, lang } };
  },

  menus: async ({ lang = "en", location } = {}) => {
    await delay(120);
    let items = [];
    if (location === "header") items = db.menus.header;
    else if (location === "footer") items = db.menus.footer;
    else items = [...db.menus.header, ...db.menus.footer];
    return { data: clone(items).sort(byPosition).map((item) => ({ ...item, label: t(item.label, lang) })) };
  },

  footerBlocks: async ({ lang = "en" } = {}) => {
    await delay(120);
    return {
      data: clone(db.footer)
        .sort(byPosition)
        .map((block) => ({
          ...block,
          title: t(block.title, lang),
          content: t(block.content, lang),
        })),
    };
  },

  pages: async ({ slug, lang = "en" }) => {
    await delay(120);
    const page = db.pages[slug];
    if (!page || page.status !== "published") {
      throw { response: { status: 404, data: { error: { code: "not_found", message: "Page not published" } } } };
    }
    const sections = clone(page.sections).sort(byPosition).map((section) => ({
      ...section,
      content: section.content?.[lang] ?? section.content?.en ?? section.content,
    }));
    return { data: { ...clone(page), title: t(page.title, lang), sections } };
  },

  home: async ({ lang = "en" } = {}) => mockPublic.pages({ slug: "home", lang }),
};

// ===== Users (admin) =====
export const mockUsers = {
  list: async () => {
    await delay(180);
    return { data: db.users.users.map(plainUser) };
  },

  get: async (id) => {
    await delay(120);
    const user = find(db.users.users, id);
    if (!user) throw { response: { status: 404 } };
    return { data: plainUser(user) };
  },

  create: async (data) => {
    await delay(250);
    const role = data.role || "student";
    const yearLevel = studentYearLevel(data);

    // Only students carry the roster's required fields; other roles are unchanged.
    if (role === "student") {
      const fields = validateStudentFields(data, yearLevel);
      if (Object.keys(fields).length) throw validationError(fields);
      assertUniqueIdentity(data.email);
    }

    const user = {
      id: nextId("u"),
      email: text(data.email) || data.email,
      role,
      full_name: text(data.full_name) || "New user",
      preferred_lang: data.preferred_lang || "en",
      is_active: data.is_active !== false,
      login_method: role === "student" ? "pin" : "password",
      password_hash: "$2b$12$mock.hash",
      avatar: data.avatar || role,
      avatar_url: data.avatar_url || (role === "student" ? "/asset/images/user2.png" : "/asset/images/user.png"),
      grade: yearLevel || (role === "student" ? "Grade 1" : undefined),
      year_level: role === "student" ? yearLevel : undefined,
      class_name: data.class_name || (role === "student" ? "1A" : undefined),
      phone: data.phone || "",
      created_at: new Date().toISOString(),
    };
    if (role === "student") {
      // Exactly one credential always results: supplied, or generated when blank.
      user.login_pin = text(data.login_pin) || String(Math.floor(1000 + Math.random() * 8999));
    }
    db.users.users.push(user);
    persist();
    return { data: plainUser(user) };
  },

  update: async (id, updates) => {
    await delay(220);
    const user = find(db.users.users, id);
    if (!user) throw { response: { status: 404 } };

    const role = updates.role || user.role;
    const yearLevel = studentYearLevel({ ...user, ...updates });

    if (role === "student") {
      const fields = validateStudentFields({ ...user, ...updates }, yearLevel);
      if (Object.keys(fields).length) throw validationError(fields);
      // The record's own current identity is never a conflict with itself.
      assertUniqueIdentity(updates.email ?? user.email, id);
    }

    Object.assign(user, updates);
    if (role === "student" && yearLevel) {
      user.year_level = yearLevel;
      user.grade = yearLevel;
    }
    persist();
    return { data: plainUser(user) };
  },

  remove: async (id) => {
    await delay(200);
    // Ordered cleanup in one pass, then both storage keys are flushed once.
    purgeDependentRecords(id);
    persist();
    persistLinks();
    return { data: { ok: true } };
  },

  // Roster query: students only, narrowed by a forgiving search and a class filter.
  students: async ({ search, class_name } = {}) => {
    await delay(180);
    const needle = identityKey(search);
    const wantedClass = text(class_name);

    const all = db.users.users.filter((user) => user.role === "student");

    const classes = [
      ...new Set(all.map((user) => text(user.class_name || user.grade)).filter(Boolean)),
    ].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

    let students = all;
    if (needle) {
      students = students.filter(
        (user) =>
          identityKey(user.full_name).includes(needle) ||
          identityKey(user.email).includes(needle)
      );
    }
    if (wantedClass && wantedClass !== "all") {
      students = students.filter((user) => text(user.class_name) === wantedClass);
    }

    return { data: { students: students.map(plainUser), classes } };
  },


  links: {
    list: async () => {
      await delay(120);
      return { data: clone(db.users.links) };
    },
    create: async (link) => {
      await delay(200);
      if (link.student_id && link.parent_id) {
        const exists = db.users.links.student_parent.some(
          (item) => item.student_id === link.student_id && item.parent_id === link.parent_id
        );
        if (!exists) db.users.links.student_parent.push({ student_id: link.student_id, parent_id: link.parent_id });
      }
      if (link.teacher_id && link.student_id) {
        const exists = db.users.links.teacher_student.some(
          (item) => item.student_id === link.student_id && item.teacher_id === link.teacher_id
        );
        if (!exists) db.users.links.teacher_student.push({ teacher_id: link.teacher_id, student_id: link.student_id });
      }
      persist();
      persistLinks();
      return { data: clone(db.users.links) };
    },
    remove: async ({ student_id, parent_id, teacher_id }) => {
      await delay(180);
      db.users.links.student_parent = db.users.links.student_parent.filter(
        (item) => !(item.student_id === student_id && item.parent_id === parent_id)
      );
      db.users.links.teacher_student = db.users.links.teacher_student.filter(
        (item) => !(item.student_id === student_id && item.teacher_id === teacher_id)
      );
      persist();
      persistLinks();
      return { data: clone(db.users.links) };
    },
  },
};

// ===== Content library =====
const crud = (collection, prefix) => ({
  list: async (filter = {}) => {
    await delay(150);
    let rows = db[collection];
    if (filter.subject_id) rows = rows.filter((row) => row.subject_id === filter.subject_id);
    if (filter.course_id) rows = rows.filter((row) => row.course_id === filter.course_id);
    if (filter.lesson_id) rows = rows.filter((row) => row.lesson_id === filter.lesson_id);
    if (filter.publishedOnly) rows = rows.filter((row) => row.is_published !== false);
    return { data: clone(rows).sort(byPosition) };
  },
  get: async (id) => {
    await delay(120);
    const row = find(db[collection], id);
    if (!row) throw { response: { status: 404 } };
    return { data: clone(row) };
  },
  create: async (data) => {
    await delay(250);
    const row = {
      ...data,
      id: nextId(prefix),
      position: data.position ?? (Math.max(0, ...db[collection].map((item) => item.position || 0)) + 1),
      is_published: data.is_published !== false,
    };
    db[collection].push(row);
    persist();
    return { data: clone(row) };
  },
  update: async (id, updates) => {
    await delay(220);
    const row = find(db[collection], id);
    if (!row) throw { response: { status: 404 } };
    Object.assign(row, updates);
    persist();
    return { data: clone(row) };
  },
  remove: async (id) => {
    await delay(180);
    db[collection] = db[collection].filter((row) => row.id !== id);
    if (collection === "subjects") {
      // Deleting a subject removes its whole content tree: courses, lessons,
      // quizzes and questions. Compute ids before filtering so orphans are not
      // left behind at any level.
      const courseIds = db.courses
        .filter((row) => row.subject_id === id)
        .map((row) => row.id);
      const lessonIds = db.lessons
        .filter((row) => courseIds.includes(row.course_id))
        .map((row) => row.id);
      const quizIds = db.quizzes
        .filter((row) => lessonIds.includes(row.lesson_id))
        .map((row) => row.id);
      db.questions = db.questions.filter((row) => !quizIds.includes(row.quiz_id));
      db.quizzes = db.quizzes.filter((row) => !lessonIds.includes(row.lesson_id));
      db.lessons = db.lessons.filter((row) => !courseIds.includes(row.course_id));
      db.courses = db.courses.filter((row) => row.subject_id !== id);
    }
    if (collection === "courses") db.lessons = db.lessons.filter((row) => row.course_id !== id);
    if (collection === "lessons") db.quizzes = db.quizzes.filter((row) => row.lesson_id !== id);
    if (collection === "quizzes") db.questions = db.questions.filter((row) => row.quiz_id !== id);
    persist();
    return { data: { ok: true } };
  },
});

export const mockContent = {
  subjects: crud("subjects", "sub"),
  courses: crud("courses", "c"),
  lessons: {
    ...crud("lessons", "l"),
    complete: async (id) => {
      await delay(200);
      return { data: { lesson_id: id, completed: true, completed_at: new Date().toISOString() } };
    },
  },
  quizzes: crud("quizzes", "q"),
  questions: {
    list: async (quizId) => {
      await delay(150);
      return { data: clone(db.questions).filter((q) => q.quiz_id === quizId).sort(byPosition) };
    },
    get: async (id) => {
      await delay(120);
      const question = find(db.questions, id);
      if (!question) throw { response: { status: 404 } };
      return { data: clone(question) };
    },
    create: async (data) => {
      await delay(220);
      const question = {
        id: nextId("qa"),
        position: data.position ?? (Math.max(0, ...db.questions.filter((q) => q.quiz_id === data.quiz_id).map((q) => q.position || 0)) + 1),
        image_url: null,
        options: [],
        ...data,
      };
      db.questions.push(question);
      persist();
      return { data: clone(question) };
    },
    update: async (id, updates) => {
      await delay(200);
      const question = find(db.questions, id);
      if (!question) throw { response: { status: 404 } };
      Object.assign(question, updates);
      persist();
      return { data: clone(question) };
    },
    remove: async (id) => {
      await delay(160);
      db.questions = db.questions.filter((q) => q.id !== id);
      persist();
      return { data: { ok: true } };
    },
  },
};

// ===== Assignments =====
export const mockAssignments = {
  list: async ({ studentId, teacherId } = {}) => {
    await delay(200);
    let rows = clone(db.assignments);
    if (studentId) {
      rows = rows.filter((assignment) =>
        (assignment.targets || []).some((target) => target.student_id === studentId)
      );
    }
    if (teacherId) rows = rows.filter((assignment) => assignment.assigned_by === teacherId);
    return { data: rows };
  },

  get: async (id) => {
    await delay(150);
    const assignment = find(db.assignments, id);
    if (!assignment) throw { response: { status: 404 } };
    return { data: clone(assignment) };
  },

  create: async (data) => {
    await delay(280);
    const assignmentId = nextId("a");
    const assignment = {
      id: assignmentId,
      item_type: data.item_type || "lesson",
      item_id: data.item_id || null,
      assigned_by: data.assigned_by,
      due_date: data.due_date || null,
      title: data.title,
      instructions: data.instructions || { en: "" },
      targets: (data.student_ids || []).map((studentId) => ({
        id: `${assignmentId}-${studentId}`,
        assignment_id: assignmentId,
        student_id: studentId,
        status: "not_started",
        completed_at: null,
      })),
    };
    db.assignments.push(assignment);
    persist();
    return { data: clone(assignment) };
  },

  update: async (id, updates) => {
    await delay(200);
    const assignment = find(db.assignments, id);
    if (!assignment) throw { response: { status: 404 } };
    Object.assign(assignment, updates);
    persist();
    return { data: clone(assignment) };
  },

  remove: async (id) => {
    await delay(180);
    db.assignments = db.assignments.filter((assignment) => assignment.id !== id);
    persist();
    return { data: { ok: true } };
  },

  targets: {
    list: async ({ studentId } = {}) => {
      await delay(180);
      let targets = allTargets();
      if (studentId) targets = targets.filter((target) => target.student_id === studentId);
      return { data: targets.map(decorateTarget) };
    },
    update: async (id, updates) => {
      await delay(180);
      let found = null;
      db.assignments.forEach((assignment) => {
        (assignment.targets || []).forEach((target) => {
          const idForTarget = target.id || targetId(assignment, target.student_id);
          if (idForTarget === id) {
            Object.assign(target, updates, { id: idForTarget, assignment_id: assignment.id });
            found = { ...target, assignment_id: assignment.id };
          }
        });
      });
      if (!found) throw { response: { status: 404 } };
      persist();
      return { data: found };
    },
  },
};

// ===== Submissions, grading and quiz attempts =====
export const mockGrading = {
  submissions: {
    list: async ({ studentId, pending } = {}) => {
      await delay(200);
      let rows = db.submissions.map((submission) => {
        const target = findTarget(submission.target_id);
        const student = target ? find(db.users.users, target.student_id) : null;
        return {
          ...submission,
          target,
          student_name: student?.full_name || "Unknown student",
          student_avatar_url: student?.avatar_url,
          assignment_title: target?.title,
          graded: Boolean(gradeForSubmission(submission.id)),
        };
      });
      if (studentId) {
        rows = rows.filter(
          (row) => row.target?.student_id === studentId || row.student_id === studentId
        );
      }
      if (pending) rows = rows.filter((row) => !row.graded);
      return { data: rows };
    },

    get: async (id) => {
      await delay(150);
      const submission = find(db.submissions, id);
      if (!submission) throw { response: { status: 404 } };
      return { data: clone(submission) };
    },

    create: async (data) => {
      await delay(260);
      const submission = {
        id: nextId("s"),
        target_id: data.target_id,
        student_id: data.student_id,
        file_url: data.file_url || null,
        file_name: data.file_name || null,
        text: data.text || "",
        submitted_at: new Date().toISOString(),
        status: "submitted",
      };
      db.submissions.push(submission);
      const target = findTarget(data.target_id);
      if (target) {
        db.assignments.forEach((assignment) => {
          (assignment.targets || []).forEach((item) => {
            const idForTarget = item.id || targetId(assignment, item.student_id);
            if (idForTarget === data.target_id) {
              item.status = "submitted";
              item.submitted_at = submission.submitted_at;
            }
          });
        });
      }
      persist();
      return { data: clone(submission) };
    },
  },

  grades: {
    list: async ({ studentId } = {}) => {
      await delay(180);
      let rows = db.grades.map((grade) => {
        const submission = db.submissions.find((sub) => sub.id === grade.submission_id);
        const target = submission ? findTarget(submission.target_id) : null;
        const student = target ? find(db.users.users, target.student_id) : null;
        return {
          ...grade,
          submission,
          target,
          student_name: student?.full_name || "Unknown student",
          assignment_title: target?.title,
        };
      });
      if (studentId) {
        rows = rows.filter((grade) => grade.target?.student_id === studentId);
      }
      return { data: rows };
    },

    grade: async (submissionId, { score, comment }) => {
      await delay(260);
      const submission = db.submissions.find((sub) => sub.id === submissionId);
      let grade = db.grades.find((item) => item.submission_id === submissionId);
      if (grade) {
        Object.assign(grade, { score: Number(score), comment, graded_at: new Date().toISOString() });
      } else {
        grade = {
          id: nextId("g"),
          submission_id: submissionId,
          score: Number(score),
          comment,
          graded_by: "u2",
          graded_at: new Date().toISOString(),
        };
        db.grades.push(grade);
      }
      if (submission) submission.status = "graded";
      const target = submission ? findTarget(submission.target_id) : null;
      if (target) {
        db.assignments.forEach((assignment) => {
          (assignment.targets || []).forEach((item) => {
            const idForTarget = item.id || targetId(assignment, item.student_id);
            if (idForTarget === target.id) {
              item.status = "graded";
              item.completed_at = new Date().toISOString();
            }
          });
        });
      }
      persist();
      return { data: clone(grade) };
    },
  },

  quizAttempt: async (quizId, answers, studentId = "u3") => {
    await delay(400);
    const quizQuestions = db.questions.filter((question) => question.quiz_id === quizId);
    let score = 0;
    const details = quizQuestions.map((question) => {
      const picked = answers[question.id];
      const correct = (question.options || []).find((option) => option.is_correct);
      const isCorrect = Boolean(picked && correct && picked === correct.id);
      if (isCorrect) score += 1;
      return {
        question_id: question.id,
        text: question.text,
        picked,
        correct: correct?.id,
        is_correct: isCorrect,
      };
    });
    const maxScore = quizQuestions.length;
    const percentage = maxScore ? Math.round((score / maxScore) * 100) : 0;
    const attempt = {
      id: nextId("attempt"),
      quiz_id: quizId,
      student_id: studentId,
      score,
      max_score: maxScore,
      percentage,
      answers: details,
      created_at: new Date().toISOString(),
    };
    db.attempts.push(attempt);

    // Mark the matching quiz assignment as completed for this student.
    db.assignments.forEach((assignment) => {
      if (assignment.item_type === "quiz" && assignment.item_id === quizId) {
        (assignment.targets || []).forEach((target) => {
          if (target.student_id === studentId && target.status !== "graded") {
            target.status = "completed";
            target.completed_at = attempt.created_at;
            target.id = target.id || targetId(assignment, studentId);
          }
        });
      }
    });
    persist();
    return { data: attempt };
  },

  attempts: {
    list: async ({ studentId, quizId } = {}) => {
      await delay(150);
      let rows = clone(db.attempts);
      if (studentId) rows = rows.filter((attempt) => attempt.student_id === studentId);
      if (quizId) rows = rows.filter((attempt) => attempt.quiz_id === quizId);
      return { data: rows.sort((a, b) => b.created_at.localeCompare(a.created_at)) };
    },
  },
};

// ===== Progress =====
export const mockProgress = {
  student: async (studentId) => {
    await delay(200);
    return { data: studentSnapshot(studentId) };
  },

  children: async (parentId) => {
    await delay(200);
    const ids = db.users.links.student_parent
      .filter((link) => link.parent_id === parentId)
      .map((link) => link.student_id);
    const children = ids
      .map((id) => find(db.users.users, id))
      .filter(Boolean)
      .map((student) => ({ ...plainUser(student), progress: studentSnapshot(student.id).stats }));
    return { data: children };
  },

  class: async (teacherId) => {
    await delay(220);
    const ids = db.users.links.teacher_student
      .filter((link) => link.teacher_id === teacherId)
      .map((link) => link.student_id);
    const students = ids
      .map((id) => find(db.users.users, id))
      .filter(Boolean)
      .map((student) => {
        const snapshot = studentSnapshot(student.id);
        return { ...plainUser(student), progress: snapshot.stats, items: snapshot.items };
      });
    return { data: students };
  },
};

// ===== CMS =====
export const mockCms = {
  settings: {
    get: async () => {
      await delay(150);
      return { data: clone(db.settings) };
    },
    update: async (updates) => {
      await delay(260);
      db.settings = {
        ...db.settings,
        ...updates,
        brand_colors: { ...db.settings.brand_colors, ...(updates.brand_colors || {}) },
        contact: { ...db.settings.contact, ...(updates.contact || {}) },
        social: { ...db.settings.social, ...(updates.social || {}) },
      };
      persist();
      return { data: clone(db.settings) };
    },
  },

  menus: {
    list: async ({ location } = {}) => {
      await delay(140);
      const rows = location ? db.menus[location] : [...db.menus.header, ...db.menus.footer];
      return { data: clone(rows).sort(byPosition) };
    },
    create: async (location, data) => {
      await delay(220);
      const rows = db.menus[location] || [];
      const item = {
        id: nextId("m"),
        label: data.label || { en: "", km: "", ar: "" },
        url: data.url || "/",
        position: data.position ?? rows.length + 1,
        parent_id: data.parent_id || null,
        is_visible: data.is_visible !== false,
      };
      rows.push(item);
      db.menus[location] = rows;
      persist();
      return { data: clone(item) };
    },
    update: async (id, updates) => {
      await delay(200);
      let found = null;
      ["header", "footer"].forEach((location) => {
        const item = db.menus[location].find((row) => row.id === id);
        if (item) {
          Object.assign(item, updates);
          found = item;
        }
      });
      if (!found) throw { response: { status: 404 } };
      persist();
      return { data: clone(found) };
    },
    remove: async (id) => {
      await delay(180);
      ["header", "footer"].forEach((location) => {
        db.menus[location] = db.menus[location].filter(
          (item) => item.id !== id && item.parent_id !== id
        );
      });
      persist();
      return { data: { ok: true } };
    },
    move: async (id, direction) => {
      await delay(160);
      ["header", "footer"].forEach((location) => {
        const siblings = db.menus[location]
          .filter((item) => (item.parent_id || null) === null)
          .sort(byPosition);
        const index = siblings.findIndex((item) => item.id === id);
        if (index === -1) return;
        const swapIndex = direction === "up" ? index - 1 : index + 1;
        if (swapIndex < 0 || swapIndex >= siblings.length) return;
        const current = siblings[index];
        const other = siblings[swapIndex];
        [current.position, other.position] = [other.position, current.position];
      });
      persist();
      return { data: { ok: true } };
    },
  },

  footer: {
    list: async () => {
      await delay(140);
      return { data: clone(db.footer).sort(byPosition) };
    },
    create: async (data) => {
      await delay(220);
      const block = {
        id: nextId("b"),
        title: data.title || { en: "", km: "", ar: "" },
        content: data.content || { en: "", km: "", ar: "" },
        position: data.position ?? db.footer.length + 1,
      };
      db.footer.push(block);
      persist();
      return { data: clone(block) };
    },
    update: async (id, updates) => {
      await delay(200);
      const block = find(db.footer, id);
      if (!block) throw { response: { status: 404 } };
      Object.assign(block, updates);
      persist();
      return { data: clone(block) };
    },
    remove: async (id) => {
      await delay(160);
      db.footer = db.footer.filter((block) => block.id !== id);
      persist();
      return { data: { ok: true } };
    },
    move: async (id, direction) => {
      await delay(150);
      const blocks = [...db.footer].sort(byPosition);
      const index = blocks.findIndex((block) => block.id === id);
      if (index === -1) return { data: { ok: true } };
      const swapIndex = direction === "up" ? index - 1 : index + 1;
      if (swapIndex < 0 || swapIndex >= blocks.length) return { data: { ok: true } };
      [blocks[index].position, blocks[swapIndex].position] = [blocks[swapIndex].position, blocks[index].position];
      persist();
      return { data: { ok: true } };
    },
  },

  pages: {
    list: async () => {
      await delay(160);
      return { data: Object.values(db.pages).map((page) => clone(page)) };
    },
    get: async (slug) => {
      await delay(120);
      const page = db.pages[slug];
      if (!page) throw { response: { status: 404 } };
      return { data: clone(page) };
    },
    update: async (slug, updates) => {
      await delay(240);
      const page = db.pages[slug];
      if (!page) throw { response: { status: 404 } };
      Object.assign(page, updates);
      persist();
      return { data: clone(page) };
    },
  },
};

export const mockMedia = {
  list: async () => {
    await delay(140);
    return { data: clone(db.media).sort((a, b) => a.name.localeCompare(b.name)) };
  },
  add: async (file) => {
    await delay(180);
    const asset = {
      id: nextId("img"),
      name: file.name,
      url: file.url,
      type: file.type || "image/png",
      size: file.size || 0,
      alt: file.alt || file.name,
      created_at: new Date().toISOString(),
    };
    db.media.push(asset);
    persist();
    return { data: asset };
  },
};

export default {
  auth: mockAuth,
  public: mockPublic,
  users: mockUsers,
  content: mockContent,
  assignments: mockAssignments,
  grading: mockGrading,
  progress: mockProgress,
  cms: mockCms,
  media: mockMedia,
};
