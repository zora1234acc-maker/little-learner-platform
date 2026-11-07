import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

const routeLabels = {
  "/admin/dashboard": "Dashboard",
  "/admin/users": "Users",
  "/admin/content": "Content",
  "/admin/cms": "CMS",
  "/admin/grading": "Grading",
  "/teacher/library": "Library",
  "/teacher/assign": "Assignments",
  "/teacher/grading": "Grading",
  "/teacher/class-progress": "Class Progress",
  "/student/todo": "My To-do",
  "/student/progress": "Progress",
  "/parent": "My Children",
};

export function Breadcrumb() {
  const { t } = useTranslation();
  const location = useLocation();
  const path = location.pathname;

  // Build breadcrumb from path segments
  const segments = path.split("/").filter(Boolean);
  const items = segments.map((_, i) => {
    const route = "/" + segments.slice(0, i + 1).join("/");
    const label = routeLabels[route] || segments[i];
    const isLast = i === segments.length - 1;
    return { route, label, isLast };
  });

  if (items.length <= 1) return null;

  return (
    <nav className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground mb-6" aria-label="Breadcrumb">
      <Link to="/" className="hover:text-foreground transition-colors">
        Home
      </Link>
      {items.map((item, i) => (
        <React.Fragment key={item.route}>
          <ChevronRight className="w-3 h-3 mx-1" />
          {item.isLast ? (
            <span className="text-foreground font-medium">{item.label}</span>
          ) : (
            <Link to={item.route} className="hover:text-foreground transition-colors">
              {item.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
