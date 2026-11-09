import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import React from "react";
import { AuthProvider, useAuth } from "./AuthContext";

const clearStorage = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  localStorage.removeItem("links");
};

const setUser = (user) => localStorage.setItem("user", JSON.stringify(user));
const setLinks = (links) => localStorage.setItem("links", JSON.stringify(links));

// Renders nothing, reports access result via the DOM after canAccessStudent runs.
const AccessProbe = ({ studentId }) => {
  const { canAccessStudent } = useAuth();
  const [result, setResult] = React.useState(null);
  React.useEffect(() => {
    setResult(canAccessStudent(studentId));
  }, [canAccessStudent, studentId]);
  return <div data-testid="access">{result == null ? "loading" : String(result)}</div>;
};

describe("canAccessStudent", () => {
  beforeEach(() => {
    clearStorage();
  });

  afterEach(() => {
    clearStorage();
  });

  it("admin can access any student", () => {
    setUser({ id: "u1", role: "admin", full_name: "Admin" });
    render(
      <AuthProvider>
        <AccessProbe studentId="u999" />
      </AuthProvider>
    );
    expect(screen.getByTestId("access")).toHaveTextContent("true");
  });

  it("student can access their own id", () => {
    setUser({ id: "u3", role: "student", full_name: "Sophal" });
    render(
      <AuthProvider>
        <AccessProbe studentId="u3" />
      </AuthProvider>
    );
    expect(screen.getByTestId("access")).toHaveTextContent("true");
  });

  it("student cannot access another student", () => {
    setUser({ id: "u3", role: "student", full_name: "Sophal" });
    render(
      <AuthProvider>
        <AccessProbe studentId="u5" />
      </AuthProvider>
    );
    expect(screen.getByTestId("access")).toHaveTextContent("false");
  });

  it("parent can access a linked child", () => {
    setUser({ id: "u4", role: "parent", full_name: "Mr. Somchai" });
    setLinks({ student_parent: [{ parent_id: "u4", student_id: "u3" }], teacher_student: [] });
    render(
      <AuthProvider>
        <AccessProbe studentId="u3" />
      </AuthProvider>
    );
    expect(screen.getByTestId("access")).toHaveTextContent("true");
  });

  it("parent cannot access an unlinked child", () => {
    setUser({ id: "u4", role: "parent", full_name: "Mr. Somchai" });
    setLinks({ student_parent: [], teacher_student: [] });
    render(
      <AuthProvider>
        <AccessProbe studentId="u3" />
      </AuthProvider>
    );
    expect(screen.getByTestId("access")).toHaveTextContent("false");
  });

  it("teacher can access a linked student", () => {
    setUser({ id: "u2", role: "teacher", full_name: "Ms. Sreynith" });
    setLinks({ student_parent: [], teacher_student: [{ teacher_id: "u2", student_id: "u3" }] });
    render(
      <AuthProvider>
        <AccessProbe studentId="u3" />
      </AuthProvider>
    );
    expect(screen.getByTestId("access")).toHaveTextContent("true");
  });

  it("teacher cannot access an unlinked student", () => {
    setUser({ id: "u2", role: "teacher", full_name: "Ms. Sreynith" });
    setLinks({ student_parent: [], teacher_student: [] });
    render(
      <AuthProvider>
        <AccessProbe studentId="u999" />
      </AuthProvider>
    );
    expect(screen.getByTestId("access")).toHaveTextContent("false");
  });

  it("returns false when no user is signed in", () => {
    render(
      <AuthProvider>
        <AccessProbe studentId="u3" />
      </AuthProvider>
    );
    expect(screen.getByTestId("access")).toHaveTextContent("false");
  });
});
