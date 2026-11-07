import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { PageHeader } from "./PageHeader";
import { Breadcrumb } from "./Breadcrumb";
import { useAuth } from "../context/AuthContext";

export function DashboardLayout() {
  const { user } = useAuth();
  const location = useLocation();

  // Public pages don't need a role layout
  if (!user) return <Outlet />;

  // Determine which sidebar to show
  let role = "admin";
  if (user.role === "teacher") role = "teacher";
  else if (user.role === "student") role = "student";
  else if (user.role === "parent") role = "parent";

  // Student and parent use SimpleLayout (no sidebar)
  if (role === "student" || role === "parent") {
    return (
      <div className="min-h-screen bg-background">
        <Outlet />
      </div>
    );
  }

  // Admin and teacher get DashboardLayout with sidebar
  return (
    <div className="min-h-screen bg-background">
      <Sidebar role={role} />
      <div className="md:pl-64">
        <div className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md supports-[backdrop-blur]:bg-background/80 px-4 py-3">
          <Breadcrumb />
        </div>
        <main className="container mx-auto px-4 py-6 md:py-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
