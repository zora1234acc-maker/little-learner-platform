import { describe, it, expect, beforeEach } from "vitest";
import {
  mockContent,
  mockAssignments,
  mockProgress,
  resetMockDatabase,
} from "./mock";

beforeEach(() => {
  resetMockDatabase();
  localStorage.removeItem("token");
  localStorage.removeItem("user");
});

describe("mockContent subjects CRUD", () => {
  it("create assigns an id, position and is_published", async () => {
    const before = await mockContent.subjects.list();
    const maxPos = Math.max(0, ...before.data.map((s) => s.position || 0));

    const res = await mockContent.subjects.create({
      title: { en: "Math", km: "គុណនី" },
      description: { en: "Numbers" },
    });

    expect(res.data.id).toMatch(/^sub/);
    expect(res.data.position).toBe(maxPos + 1);
    expect(res.data.is_published).toBe(true);
    expect(res.data.title.en).toBe("Math");
  });

  it("create does not publish when is_published is false", async () => {
    const res = await mockContent.subjects.create({
      title: { en: "Draft" },
      is_published: false,
    });
    expect(res.data.is_published).toBe(false);
  });

  it("list returns subjects sorted by position", async () => {
    await mockContent.subjects.create({ title: { en: "B" }, position: 99 });
    await mockContent.subjects.create({ title: { en: "A" }, position: 100 });

    const res = await mockContent.subjects.list();
    const positions = res.data.map((s) => s.position || 0);
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
  });

  it("list filters by publishedOnly", async () => {
    await mockContent.subjects.create({ title: { en: "Pub" }, is_published: true });
    await mockContent.subjects.create({ title: { en: "Draft" }, is_published: false });

    const res = await mockContent.subjects.list({ publishedOnly: true });
    expect(res.data.every((s) => s.is_published !== false)).toBe(true);
    expect(res.data.map((s) => s.title.en)).toContain("Pub");
  });

  it("get returns a clone of the subject", async () => {
    const created = await mockContent.subjects.create({ title: { en: "Math" } });
    const res = await mockContent.subjects.get(created.data.id);

    expect(res.data.id).toBe(created.data.id);
    expect(res.data).not.toBe(created.data); // clone, not same reference
  });

  it("get throws 404 for missing subject", async () => {
    await expect(mockContent.subjects.get("nope")).rejects.toMatchObject({
      response: { status: 404 },
    });
  });

  it("update changes fields and returns a clone", async () => {
    const created = await mockContent.subjects.create({ title: { en: "Math" } });
    const res = await mockContent.subjects.update(created.data.id, {
      title: { en: "Arithmetic" },
    });

    expect(res.data.title.en).toBe("Arithmetic");
    expect(res.data).not.toBe(created.data);
  });

  it("remove deletes the subject and cascades to courses, lessons, quizzes, questions", async () => {
    const subject = await mockContent.subjects.create({ title: { en: "Math" } });
    const course = await mockContent.courses.create({
      subject_id: subject.data.id,
      title: { en: "Grade 1 Math" },
    });
    const lesson = await mockContent.lessons.create({
      course_id: course.data.id,
      title: { en: "Addition" },
    });
    const quiz = await mockContent.quizzes.create({
      lesson_id: lesson.data.id,
      title: { en: "Quiz 1" },
    });
    await mockContent.questions.create({
      quiz_id: quiz.data.id,
      text: { en: "1+1?" },
      options: [{ id: "o1", text: { en: "2" }, is_correct: true }],
    });

    await mockContent.subjects.remove(subject.data.id);

    await expect(mockContent.subjects.get(subject.data.id)).rejects.toMatchObject({
      response: { status: 404 },
    });
    await expect(mockContent.courses.get(course.data.id)).rejects.toMatchObject({
      response: { status: 404 },
    });
    await expect(mockContent.lessons.get(lesson.data.id)).rejects.toMatchObject({
      response: { status: 404 },
    });
    await expect(mockContent.quizzes.get(quiz.data.id)).rejects.toMatchObject({
      response: { status: 404 },
    });
    await expect(mockContent.questions.get("o1")).rejects.toMatchObject({
      response: { status: 404 },
    });
  });
});

describe("mockProgress.student snapshot", () => {
  const STUDENT = "u3";

  it("computes total, completed, overdue and avgScore", async () => {
    const past = "2020-01-01";
    await mockAssignments.create({
      item_type: "lesson",
      item_id: "l1",
      assigned_by: "u2",
      due_date: past,
      title: { en: "Overdue lesson" },
      student_ids: [STUDENT],
    });

    const res = await mockProgress.student(STUDENT);

    expect(res.data.student.id).toBe(STUDENT);
    expect(res.data.stats.total).toBeGreaterThanOrEqual(1);
    expect(res.data.stats.overdue).toBeGreaterThanOrEqual(1);
    expect(typeof res.data.stats.avgScore).toBe("number");
  });

  it("avgScore is 0 when there are no scored items", async () => {
    const res = await mockProgress.student("u999"); // no assignments

    expect(res.data.stats.total).toBe(0);
    expect(res.data.stats.avgScore).toBe(0);
  });
});
