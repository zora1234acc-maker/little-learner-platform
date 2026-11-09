import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mockUsers, resetMockDatabase } from "./mock";

const LINKS_KEY = "links";

describe("mockUsers.links persists to localStorage", () => {
  beforeEach(() => {
    resetMockDatabase();
    localStorage.removeItem(LINKS_KEY);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  });

  afterEach(() => {
    localStorage.removeItem(LINKS_KEY);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  });

  it("create student_parent link writes to localStorage links", async () => {
    await mockUsers.links.create({ student_id: "u3", parent_id: "u4" });

    const links = JSON.parse(localStorage.getItem(LINKS_KEY));
    expect(links.student_parent).toContainEqual({ student_id: "u3", parent_id: "u4" });
  });

  it("create teacher_student link writes to localStorage links", async () => {
    await mockUsers.links.create({ teacher_id: "u2", student_id: "u3" });

    const links = JSON.parse(localStorage.getItem(LINKS_KEY));
    expect(links.teacher_student).toContainEqual({ teacher_id: "u2", student_id: "u3" });
  });

  it("remove student_parent link removes from localStorage links", async () => {
    await mockUsers.links.create({ student_id: "u3", parent_id: "u4" });
    await mockUsers.links.remove({ student_id: "u3", parent_id: "u4" });

    const links = JSON.parse(localStorage.getItem(LINKS_KEY));
    expect(links.student_parent).not.toContainEqual({ student_id: "u3", parent_id: "u4" });
  });
});
