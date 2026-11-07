import siteSettings from "../data/siteSettings.json";
import menus from "../data/menus.json";
import footer from "../data/footer.json";
import pages from "../data/pages.json";
import subjects from "../data/subjects.json";
import courses from "../data/courses.json";
import lessons from "../data/lessons.json";
import quizzes from "../data/quizzes.json";
import questions from "../data/questions.json";
import usersData from "../data/users.json";
import assignments from "../data/assignments.json";
import submissions from "../data/submissions.json";
import grades from "../data/grades.json";

// Simple delay to simulate network
const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

const t = (field, lang = "en") => {
  if (!field) return "";
  if (typeof field === "string") return field;
  return field[lang] || field.en || "";
};

// Helper to find item by id
const find = (arr, id) => arr.find((item) => item.id === id);

// ===== Auth =====
export const mockAuth = {
  login: async ({ email, password }) => {
    await delay(400);
    const user = usersData.users.find((u) => u.email === email);
    if (!user || !user.is_active) {
      throw { response: { status: 401, data: { error: { code: "invalid_credentials", message: "Invalid email or password" } } } };
    }
    // In mock, accept any password for active users
    const token = "mock-jwt-token-" + user.id;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify({ id: user.id, role: user.role, full_name: user.full_name, email: user.email, preferred_lang: user.preferred_lang }));
    return { data: { token, user: { id: user.id, role: user.role, full_name: user.full_name, email: user.email, preferred_lang: user.preferred_lang } } };
  },
  tokenLogin: async ({ token: loginToken }) => {
    await delay(400);
    // Mock QR/PIN login: match against login_token_hash
    const user = usersData.users.find((u) => u.login_token_hash === loginToken || u.id === loginToken);
    if (!user || user.role !== "student" || !user.is_active) {
      throw { response: { status: 401, data: { error: { code: "invalid_token", message: "Invalid QR/PIN token" } } } };
    }
    const token = "mock-jwt-token-" + user.id;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify({ id: user.id, role: user.role, full_name: user.full_name, email: user.email, preferred_lang: user.preferred_lang }));
    return { data: { token, user: { id: user.id, role: user.role, full_name: user.full_name, email: user.email, preferred_lang: user.preferred_lang } } };
  },
  me: async () => {
    await delay(200);
    const token = localStorage.getItem("token");
    if (!token) throw { response: { status: 401 } };
    const userStr = localStorage.getItem("user");
    if (!userStr) throw { response: { status: 401 } };
    return { data: JSON.parse(userStr) };
  },
  logout: async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return { data: { ok: true } };
  }
};

// ===== Public CMS =====
export const mockPublic = {
  site: async ({ lang = "en" } = {}) => {
    await delay(200);
    return { data: { settings: siteSettings, lang } };
  },
  menus: async ({ lang = "en", location } = {}) => {
    await delay(200);
    let items = [];
    if (location === "header") items = menus.header;
    else if (location === "footer") items = menus.footer;
    else items = [...menus.header, ...menus.footer];
    return { data: items.map((item) => ({ ...item, label: t(item.label, lang) })) };
  },
  pages: async ({ slug, lang = "en" }) => {
    await delay(200);
    const page = pages[slug];
    if (!page || page.status !== "published") {
      throw { response: { status: 404, data: { error: { code: "not_found", message: "Page not published" } } } };
    }
    // Translate sections
    const translatedSections = page.sections.map((section) => {
      const content = section.content[lang] || section.content.en || section.content;
      return { ...section, content };
    });
    return { data: { ...page, title: t(page.title, lang), sections: translatedSections } };
  },
  home: async ({ lang = "en" } = {}) => {
    return mockPublic.pages({ slug: "home", lang });
  }
};

// ===== Users (Admin) =====
export const mockUsers = {
  list: async () => {
    await delay(300);
    return { data: usersData.users.map((u) => ({ ...u, password_hash: undefined })) };
  },
  get: async (id) => {
    await delay(200);
    const u = find(usersData.users, id);
    if (!u) throw { response: { status: 404 } };
    return { data: { ...u, password_hash: undefined } };
  },
  create: async (userData) => {
    await delay(400);
    const newUser = { ...userData, id: "u" + Date.now(), is_active: true };
    usersData.users.push(newUser);
    return { data: newUser };
  },
  update: async (id, updates) => {
    await delay(400);
    const idx = usersData.users.findIndex((u) => u.id === id);
    if (idx === -1) throw { response: { status: 404 } };
    usersData.users[idx] = { ...usersData.users[idx], ...updates };
    return { data: usersData.users[idx] };
  },
  remove: async (id) => {
    await delay(300);
    usersData.users = usersData.users.filter((u) => u.id !== id);
    return { data: { ok: true } };
  },
  links: {
    list: async () => {
      await delay(200);
      return { data: usersData.links };
    },
    create: async (link) => {
      await delay(300);
      if (link.student_id && link.parent_id) {
        usersData.links.student_parent.push({ student_id: link.student_id, parent_id: link.parent_id });
      }
      if (link.teacher_id && link.student_id) {
        usersData.links.teacher_student.push({ teacher_id: link.teacher_id, student_id: link.student_id });
      }
      return { data: usersData.links };
    }
  }
};

// ===== Content Library =====
export const mockContent = {
  subjects: {
    list: async () => { await delay(200); return { data: subjects }; },
    get: async (id) => { await delay(200); const s = find(subjects, id); if (!s) throw { response: { status: 404 } }; return { data: s }; }
  },
  courses: {
    list: async () => { await delay(200); return { data: courses }; },
    get: async (id) => { await delay(200); const c = find(courses, id); if (!c) throw { response: { status: 404 } }; return { data: c }; }
  },
  lessons: {
    list: async () => { await delay(200); return { data: lessons }; },
    get: async (id) => { await delay(200); const l = find(lessons, id); if (!l) throw { response: { status: 404 } }; return { data: l }; },
    complete: async (id) => { await delay(300); return { data: { lesson_id: id, completed: true, completed_at: new Date().toISOString() } }; }
  },
  quizzes: {
    list: async () => { await delay(200); return { data: quizzes }; },
    get: async (id) => { await delay(200); const q = find(quizzes, id); if (!q) throw { response: { status: 404 } }; return { data: q }; }
  },
  questions: {
    list: async (quizId) => { await delay(200); return { data: questions.filter((q) => q.quiz_id === quizId) }; }
  }
};

// ===== Assignments =====
export const mockAssignments = {
  list: async () => { await delay(300); return { data: assignments }; },
  get: async (id) => { await delay(200); const a = find(assignments, id); if (!a) throw { response: { status: 404 } }; return { data: a }; },
  targets: {
    list: async () => { await delay(200); return { data: assignments.flatMap((a) => a.targets) }; },
    update: async (targetId, updates) => { await delay(300); return { data: { ...updates, id: targetId } }; }
  }
};

// ===== Submissions & Grading =====
export const mockGrading = {
  submissions: {
    list: async () => { await delay(300); return { data: submissions }; },
    get: async (id) => { await delay(200); const s = find(submissions, id); if (!s) throw { response: { status: 404 } }; return { data: s }; },
    create: async (data) => { await delay(400); const newSub = { ...data, id: "s" + Date.now(), submitted_at: new Date().toISOString(), status: "submitted" }; submissions.push(newSub); return { data: newSub }; }
  },
  grades: {
    list: async () => { await delay(300); return { data: grades }; },
    grade: async (submissionId, { score, comment }) => { await delay(400); const g = { id: "g" + Date.now(), submission_id: submissionId, score, comment, graded_by: "u2", graded_at: new Date().toISOString() }; grades.push(g); return { data: g }; }
  },
  quizAttempt: async (quizId, answers) => {
    await delay(500);
    const quiz = find(quizzes, quizId);
    const quizQuestions = questions.filter((q) => q.quiz_id === quizId);
    let score = 0;
    quizQuestions.forEach((q) => {
      const ans = answers[q.id];
      const correct = q.options.find((o) => o.is_correct);
      if (ans && ans === correct.id) score += 1;
    });
    const maxScore = quizQuestions.length;
    return { data: { quiz_id: quizId, score, max_score: maxScore, percentage: Math.round((score / maxScore) * 100) } };
  }
};

export default {
  auth: mockAuth,
  public: mockPublic,
  users: mockUsers,
  content: mockContent,
  assignments: mockAssignments,
  grading: mockGrading
};
