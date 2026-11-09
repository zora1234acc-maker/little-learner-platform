import { Outlet, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { Breadcrumb } from "./Breadcrumb";
import { Avatar } from "./Avatar";
import { useAuth } from "../context/AuthContext";
import { AnimatedBackground } from "./AnimatedBackground";

export function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return <Outlet />;

  let role = "admin";
  if (user.role === "teacher") role = "teacher";
  else if (user.role === "student") role = "student";
  else if (user.role === "parent") role = "parent";

  if (role === "student" || role === "parent") {
    return (
      <div className="relative min-h-screen overflow-hidden bg-background">
        <AnimatedBackground />
        <div className="relative z-10">
          <Outlet />
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F7F8FC]">
      <AnimatedBackground />
      <Sidebar role={role} />
      <div className="md:pl-64">
        <div className="sticky top-0 z-40 flex min-h-[72px] items-center justify-between gap-3 border-b border-[#E7E8F0] bg-white/90 px-4 py-3 backdrop-blur-md supports-[backdrop-blur]:bg-white/80 sm:px-8">
          <Breadcrumb />
          <div className="ms-auto flex items-center gap-2">
            <Avatar src={user.avatar_url} name={user.avatar || user.role} size="sm" />
            <div className="hidden text-end sm:block">
              <p className="text-xs font-bold leading-tight text-foreground">{user.full_name}</p>
              <p className="text-[11px] capitalize leading-tight text-muted-foreground">{user.role}</p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              title="Logout"
              aria-label="Logout"
              className="touch-target rounded-xl p-2 text-muted-foreground transition hover:bg-[#FFF0F4] hover:text-[#D24F75]"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
        <main className="relative z-10 container mx-auto max-w-[1400px] px-4 py-7 pb-24 md:px-8 md:py-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
