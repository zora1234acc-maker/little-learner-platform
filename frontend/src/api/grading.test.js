import { describe, it, expect, beforeEach } from "vitest";
import {
  mockContent,
  mockGrading,
  mockAssignments,
  resetMockDatabase,
} from "./mock";

beforeEach(() => {
  resetMockDatabase();
  localStorage.removeItem("token");
  localStorage.removeItem("user");
});

describe("mockGrading quizAttempt", () => {
  let quizId;
  let q1Id;
  let q2Id;
  const STUDENT = "u3";

  beforeEach(async () => {
    const quizRes = await mockContent.quizzes.create({
      title: { en: "Quiz" },
      lesson_id: "l1",
    });
    quizId = quizRes.data.id;

    const q1 = await mockContent.questions.create({
      quiz_id: quizId,
      text: { en: "One" },
      position: 1,
      options: [
        { id: "oa1", text: { en: "A" }, is_correct: true },
        { id: "oa2", text: { en: "B" }, is_correct: false },
      ],
    });
    const q2 = await mockContent.questions.create({
      quiz_id: quizId,
      text: { en: "Two" },
      position: 2,
      options: [
        { id: "ob1", text: { en: "C" }, is_correct: false },
        { id: "ob2", text: { en: "D" }, is_correct: true },
      ],
    });
    q1Id = q1.data.id;
    q2Id = q2.data.id;
  });

  it("calculates percentage and records correct/incorrect details", async () => {
    const res = await mockGrading.quizAttempt(quizId, {
      [q1Id]: "oa1", // correct
      [q2Id]: "ob1", // incorrect
    });

    expect(res.data.score).toBe(1);
    expect(res.data.max_score).toBe(2);
    expect(res.data.percentage).toBe(50);
    expect(res.data.student_id).toBe(STUDENT);
    expect(res.data.answers).toHaveLength(2);
    expect(res.data.answers[0].is_correct).toBe(true);
    expect(res.data.answers[1].is_correct).toBe(false);
    expect(res.data.answers[0].correct).toBe("oa1");
    expect(res.data.answers[1].correct).toBe("ob2");
  });

  it("scores 100% when all answers are correct", async () => {
    const res = await mockGrading.quizAttempt(quizId, {
      [q1Id]: "oa1",
      [q2Id]: "ob2",
    });
    expect(res.data.percentage).toBe(100);
  });

  it("scores 0% when no answers are provided", async () => {
    const res = await mockGrading.quizAttempt(quizId, {});
    expect(res.data.percentage).toBe(0);
    expect(res.data.score).toBe(0);
  });
});

describe("mockGrading submissions and grades", () => {
  it("create marks the assignment target as submitted", async () => {
    const assignment = await mockAssignments.create({
      item_type: "lesson",
      item_id: "l1",
      assigned_by: "u2",
      title: { en: "HW" },
      student_ids: ["u3"],
    });
    const targetId = assignment.data.targets[0].id;

    const res = await mockGrading.submissions.create({
      target_id: targetId,
      student_id: "u3",
      text: "done",
    });

    expect(res.data.status).toBe("submitted");
    expect(res.data.text).toBe("done");

    const updated = await mockAssignments.targets.update(targetId, {});
    expect(updated.data.status).toBe("submitted");
  });

  it("grade sets a score and marks the submission graded", async () => {
    const submission = await mockGrading.submissions.create({
      target_id: "t1",
      student_id: "u3",
      text: "answer",
    });

    const res = await mockGrading.grades.grade(submission.data.id, {
      score: 85,
      comment: "Nice",
    });

    expect(res.data.score).toBe(85);
    expect(res.data.comment).toBe("Nice");
    expect(res.data.graded_at).toBeDefined();
  });
});
