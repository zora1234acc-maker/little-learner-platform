import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) {
      try { setUser(JSON.parse(saved)); } catch (e) { setUser(null); }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const res = await api.auth.login(credentials);
    setUser(res.data.user);
    return res.data;
  };

  const tokenLogin = async (token) => {
    const res = await api.auth.tokenLogin({ token });
    setUser(res.data.user);
    return res.data;
  };

  const logout = async () => {
    await api.auth.logout();
    setUser(null);
  };

  const hasRole = (roles) => {
    if (!user) return false;
    return Array.isArray(roles) ? roles.includes(user.role) : user.role === roles;
  };

  const canAccessStudent = (studentId) => {
    if (!user) return false;
    if (user.role === "admin") return true;
    if (user.role === "parent") {
      // parent can only access linked children
      const links = JSON.parse(localStorage.getItem("links") || "{}");
      return links.student_parent && links.student_parent.some((lp) => lp.parent_id === user.id && lp.student_id === studentId);
    }
    if (user.role === "teacher") {
      const links = JSON.parse(localStorage.getItem("links") || "{}");
      return links.teacher_student && links.teacher_student.some((lt) => lt.teacher_id === user.id && lt.student_id === studentId);
    }
    return user.id === studentId; // student can access own
  };

  const value = {
    user,
    loading,
    login,
    tokenLogin,
    logout,
    hasRole,
    canAccessStudent,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

// Renders children only when the signed-in user can access the given student.
// Admin reaches any student; parent/teacher only linked students; student only
// their own id. Returns null (blocked) while loading or when access is denied.
export const StudentAccessGuard = ({ studentId, children }) => {
  const { user, loading, canAccessStudent } = useAuth();
  if (loading || !user) return null;
  if (!canAccessStudent(studentId)) return null;
  return children;
};
