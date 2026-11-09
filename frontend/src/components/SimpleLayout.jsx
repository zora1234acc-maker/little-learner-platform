import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { CheckSquare, Home, LogOut, TrendingUp, Users } from "lucide-react";
import { Breadcrumb } from "./Breadcrumb";
import { Avatar } from "./Avatar";
import { useAuth } from "../context/AuthContext";
import { AnimatedBackground } from "./AnimatedBackground";

const navByRole = {
  student: [
    { to: "/student/todo", label: "My to-do", icon: CheckSquare },
    { to: "/student/progress", label: "My progress", icon: TrendingUp },
  ],
  parent: [{ to: "/parent", label: "My children", icon: Users }],
};

export function SimpleLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const dashboard =
    user?.role === "parent" ? "/parent" : user?.role === "student" ? "/student/todo" : "/login";

  const navItems = navByRole[user?.role] || [];
  const isActive = (to) =>
    location.pathname === to || location.pathname.startsWith(`${to}/`);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F7F8FC]">
      <AnimatedBackground />
      <div className="sticky top-0 z-40 border-b border-[#E7E8F0] bg-white/90 backdrop-blur-md supports-[backdrop-blur]:bg-white/80">
        <div className="container mx-auto flex min-h-[72px] items-center justify-between gap-3 px-4">
          <Link to={dashboard} className="flex items-center gap-2 font-extrabold text-[#30325F]">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#514BFF] text-sm text-white">L</span>
            <span className="hidden sm:inline">Little Learner</span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="touch-target rounded-xl p-2 text-[#777A91] transition hover:bg-[#F0EFFF] hover:text-[#514BFF]"
              title="Public website"
              aria-label="Public website"
            >
              <Home className="h-4 w-4" />
            </Link>

            <div className="flex items-center gap-2 rounded-full bg-muted/40 py-1 pe-1 ps-1.5">
              <Avatar src={user?.avatar_url} name={user?.avatar || user?.role} size="xs" />
              <div className="hidden pe-1 text-end sm:block">
                <p className="text-xs font-bold leading-tight text-foreground">{user?.full_name}</p>
                <p className="text-[10px] capitalize leading-tight text-muted-foreground">{user?.role}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              title="Logout"
              aria-label="Logout"
              className="touch-target rounded-xl p-2 text-[#777A91] transition hover:bg-[#FFF0F4] hover:text-[#D24F75]"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
        {navItems.length > 0 ? (
          <nav className="container mx-auto flex gap-1 overflow-x-auto px-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex min-h-[40px] items-center gap-1.5 whitespace-nowrap border-b-2 px-3 text-sm font-bold transition ${
                    isActive(item.to)
                      ? "border-[#514BFF] text-[#514BFF]"
                      : "border-transparent text-[#777A91] hover:text-[#30325F]"
                  }`}
                >
                  <Icon className="h-4 w-4" /> {item.label}
                </Link>
              );
            })}
          </nav>
        ) : null}

        <div className="container mx-auto px-4 pb-2 pt-1">
          <Breadcrumb />
        </div>
      </div>

      <main className="relative z-10 container mx-auto max-w-[1400px] px-4 py-7 md:px-8 md:py-10">
        <Outlet />
      </main>
    </div>
  );
}
