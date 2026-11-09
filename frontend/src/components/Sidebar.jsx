import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  BookOpen,
  FileText,
  GraduationCap,
  HelpCircle,
  Image,
  Layout,
  LayoutList,
  LogOut,
  Mail,
  Menu,
  Palette,
  Users,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Avatar } from "./Avatar";

const navItemsByRole = {
  admin: [
    { to: "/admin", labelKey: "dashboard", icon: Layout, end: true },
    { to: "/admin/users", labelKey: "users", icon: Users },
    {
      to: "/admin/content",
      labelKey: "content",
      icon: GraduationCap,
      children: [
        { to: "/admin/content/subjects", label: "Subjects" },
        { to: "/admin/content/courses", label: "Courses" },
        { to: "/admin/content/lessons", label: "Lessons" },
        { to: "/admin/content/quizzes", label: "Quizzes" },
      ],
    },
    {
      to: "/admin/cms",
      labelKey: "cms",
      icon: Palette,
      children: [
        { to: "/admin/cms/settings", label: "Site settings" },
        { to: "/admin/cms/menus", label: "Menus" },
        { to: "/admin/cms/footer", label: "Footer blocks" },
        { to: "/admin/cms/pages", label: "Pages" },
        { to: "/admin/cms/media", label: "Media" },
      ],
    },
    { to: "/admin/grading", labelKey: "grading", icon: Mail },
  ],
  teacher: [
    { to: "/teacher/library", labelKey: "library", icon: BookOpen },
    { to: "/teacher/assign", labelKey: "assign", icon: FileText },
    { to: "/teacher/grading", labelKey: "grading", icon: Mail },
    { to: "/teacher/class-progress", labelKey: "classProgress", icon: Users },
  ],
};

const genericLabels = {
  "/admin/content/subjects": "Subjects",
  "/admin/content/courses": "Courses",
  "/admin/content/lessons": "Lessons",
  "/admin/content/quizzes": "Quizzes",
  "/admin/cms/settings": "Site settings",
  "/admin/cms/menus": "Menus",
  "/admin/cms/footer": "Footer blocks",
  "/admin/cms/pages": "Pages",
  "/admin/cms/media": "Media",
};

export function Sidebar({ role }) {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const items = navItemsByRole[role] || [];

  const isActive = (to, end) =>
    end ? location.pathname === to : location.pathname === to || location.pathname.startsWith(`${to}/`);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setOpen(false)} />
      )}

      <aside
        className={`fixed bottom-0 left-0 top-0 z-50 flex w-64 flex-col border-r border-[#E7E8F0] bg-white transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="flex items-center justify-between border-b border-[#E7E8F0] p-5">
          <Link to="/" className="flex items-center gap-2 text-[1.05rem] font-extrabold tracking-tight text-[#30325F]">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#514BFF] text-sm text-white">L</span>
            <span>Little Learner</span>
          </Link>
          <button
            onClick={() => setOpen(false)}
            className="rounded-md p-1 text-muted-foreground hover:bg-accent md:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mx-3 my-4 flex items-center gap-3 rounded-2xl bg-[#F6F6FC] px-3 py-3">
          <Avatar src={user?.avatar_url} name={user?.avatar || user?.role} size="md" />
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-foreground">{user?.full_name || "Guest"}</p>
            <p className="text-xs capitalize text-muted-foreground">{user?.role || role}</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3">
          {items.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.to, item.end);
            const hasChildren = item.children?.length > 0;
            const isExpanded = expanded === item.to || (hasChildren && location.pathname.startsWith(`${item.to}/`));

            return (
              <div key={item.to}>
                <div className="flex items-center gap-1">
                  <Link
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className={`flex min-h-[44px] flex-1 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      active
                        ? "bg-[#F0EFFF] text-[#514BFF]"
                        : "text-[#777A91] hover:bg-[#F6F6FC] hover:text-[#30325F]"
                    }`}
                  >
                    <Icon className="h-4 w-4" /> {t(item.labelKey)}
                  </Link>

                  {hasChildren && (
                    <button
                      type="button"
                      onClick={() => setExpanded(isExpanded ? null : item.to)}
                      className="touch-target rounded-lg p-2 text-muted-foreground hover:bg-accent"
                      aria-label={`Toggle ${t(item.labelKey)}`}
                      aria-expanded={isExpanded}
                    >
                      <LayoutList className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {hasChildren && isExpanded && (
                  <div className="ms-6 mt-1 space-y-1 border-s-2 border-border ps-3">
                    {item.children.map((child) => {
                      const childActive = location.pathname === child.to;
                      return (
                        <Link
                          key={child.to}
                          to={child.to}
                          onClick={() => setOpen(false)}
                          className={`block rounded-lg px-3 py-2 text-xs font-medium transition ${
                            childActive
                              ? "bg-blueberry/10 text-blueberry"
                              : "text-muted-foreground hover:bg-accent hover:text-foreground"
                          }`}
                        >
                          {genericLabels[child.to] || child.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          <div className="pt-6">
            <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#A0A2B4]">
              Help
            </p>
            <Link
              to="/"
              className="flex min-h-[44px] items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <HelpCircle className="h-4 w-4" /> Public website
            </Link>
            <Link
              to="/admin/cms/media"
              className="flex min-h-[44px] items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <Image className="h-4 w-4" /> Media library
            </Link>
          </div>
        </nav>

        <div className="border-t border-border p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-sm font-medium text-[#D24F75] transition-colors hover:border-[#FFD5E1] hover:bg-[#FFF0F4]"
          >
            <LogOut className="h-4 w-4" /> {t("nav.logout")}
          </button>
        </div>
      </aside>

      <button
        className="fixed bottom-4 left-4 z-40 rounded-lg border border-border bg-background p-3 text-foreground shadow-lg hover:bg-accent md:hidden"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>
    </>
  );
}
