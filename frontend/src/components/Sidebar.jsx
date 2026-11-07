import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Menu, X, GraduationCap, Users, FileText, ShieldAlert, Mail, Layout, LogOut } from "lucide-react";

const navItemsByRole = {
  admin: [
    { to: "/admin", labelKey: "dashboard", icon: <Layout className="w-4 h-4" /> },
    { to: "/admin/users", labelKey: "users", icon: <Users className="w-4 h-4" /> },
    { to: "/admin/content", labelKey: "content", icon: <GraduationCap className="w-4 h-4" /> },
    { to: "/admin/cms", labelKey: "cms", icon: <ShieldAlert className="w-4 h-4" /> },
    { to: "/admin/grading", labelKey: "grading", icon: <Mail className="w-4 h-4" /> },
  ],
  teacher: [
    { to: "/teacher/library", labelKey: "library", icon: <GraduationCap className="w-4 h-4" /> },
    { to: "/teacher/assign", labelKey: "assign", icon: <FileText className="w-4 h-4" /> },
    { to: "/teacher/grading", labelKey: "grading", icon: <Mail className="w-4 h-4" /> },
    { to: "/teacher/class-progress", labelKey: "classProgress", icon: <Users className="w-4 h-4" /> },
  ],
};

export function Sidebar({ role }) {
  const { t } = useTranslation();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const items = navItemsByRole[role] || [];

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 bottom-0 w-64 border-r border-border bg-card z-50 transform transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 md:w-64 md:shadow-none`}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-blueberry">
            <span className="text-2xl">📚</span> <span>Little Learner</span>
          </Link>
          <button
            onClick={() => setOpen(false)}
            className="md:hidden p-1 rounded-md text-muted-foreground hover:bg-accent"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-3 space-y-1">
          {items.map((item) => {
            const isActive = location.pathname === item.to || location.pathname.startsWith(item.to + "/");
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blueberry/10 text-blueberry border-r-2 border-blueberry"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                {item.icon} {t(item.labelKey)}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto p-4 border-t border-border">
          <Link
            to="/login"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-bubblegum hover:bg-bubblegum/10 transition-colors border border-transparent hover:border-bubblegum/20"
          >
            <LogOut className="w-4 h-4" /> {t("nav.logout")}
          </Link>
        </div>
      </aside>

      {/* Mobile hamburger button */}
      <button
        className="md:hidden p-2 rounded-lg border border-border bg-background text-foreground hover:bg-accent z-40"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>
    </>
  );
}
