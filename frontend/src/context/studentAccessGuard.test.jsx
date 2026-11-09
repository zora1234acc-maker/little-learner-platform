import { render } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import React from "react";
import { AuthProvider, StudentAccessGuard } from "./AuthContext";

const clearStorage = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  localStorage.removeItem("links");
};

const setUser = (user) => localStorage.setItem("user", JSON.stringify(user));
const setLinks = (links) => localStorage.setItem("links", JSON.stringify(links));

const Page = ({ name }) => <div data-testid="page">{name}</div>;

const makeApp = (studentId) => (
  <AuthProvider>
    <StudentAccessGuard studentId={studentId}>
      <Page name="child-progress" />
    </StudentAccessGuard>
  </AuthProvider>
);

describe("StudentAccessGuard route protection", () => {
  beforeEach(() => {
    clearStorage();
  });

  afterEach(() => {
    clearStorage();
  });

  it("parent can access a linked child", () => {
    setUser({ id: "u4", role: "parent", full_name: "Mr. Somchai" });
    setLinks({
      student_parent: [{ parent_id: "u4", student_id: "u3" }],
      teacher_student: [],
    });
    const { getByTestId } = render(makeApp("u3"));
    expect(getByTestId("page")).toHaveTextContent("child-progress");
  });

  it("parent cannot access an unlinked child", () => {
    setUser({ id: "u4", role: "parent", full_name: "Mr. Somchai" });
    setLinks({ student_parent: [], teacher_student: [] });
    const { queryByTestId } = render(makeApp("u999"));
    expect(queryByTestId("page")).not.toBeInTheDocument();
  });

  it("teacher can access a linked student", () => {
    setUser({ id: "u2", role: "teacher", full_name: "Ms. Sreynith" });
    setLinks({
      student_parent: [],
      teacher_student: [{ teacher_id: "u2", student_id: "u3" }],
    });
    const { getByTestId } = render(makeApp("u3"));
    expect(getByTestId("page")).toHaveTextContent("child-progress");
  });

  it("teacher cannot access an unlinked student", () => {
    setUser({ id: "u2", role: "teacher", full_name: "Ms. Sreynith" });
    setLinks({ student_parent: [], teacher_student: [] });
    const { queryByTestId } = render(makeApp("u999"));
    expect(queryByTestId("page")).not.toBeInTheDocument();
  });

  it("student can access their own id", () => {
    setUser({ id: "u3", role: "student", full_name: "Sophal" });
    const { getByTestId } = render(makeApp("u3"));
    expect(getByTestId("page")).toHaveTextContent("child-progress");
  });

  it("student cannot access another student", () => {
    setUser({ id: "u3", role: "student", full_name: "Sophal" });
    const { queryByTestId } = render(makeApp("u5"));
    expect(queryByTestId("page")).not.toBeInTheDocument();
  });

  it("admin can access any student", () => {
    setUser({ id: "u1", role: "admin", full_name: "Admin" });
    const { getByTestId } = render(makeApp("u999"));
    expect(getByTestId("page")).toHaveTextContent("child-progress");
  });

  it("blocks access when no user is signed in", () => {
    const { queryByTestId } = render(makeApp("u3"));
    expect(queryByTestId("page")).not.toBeInTheDocument();
  });
});
