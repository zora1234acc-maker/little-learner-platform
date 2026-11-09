import { Fragment } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const routeLabels = {
  "/admin": "Dashboard",
  "/admin/users": "Users",
  "/admin/content": "Content",
  "/admin/content/subjects": "Subjects",
  "/admin/content/courses": "Courses",
  "/admin/content/lessons": "Lessons",
  "/admin/content/quizzes": "Quizzes",
  "/admin/cms": "Website CMS",
  "/admin/cms/settings": "Site settings",
  "/admin/cms/menus": "Menus",
  "/admin/cms/footer": "Footer blocks",
  "/admin/cms/pages": "Pages",
  "/admin/cms/media": "Media",
  "/videos": "Videos",
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
  const location = useLocation();
  const path = location.pathname;

  const segments = path.split("/").filter(Boolean);
  const items = segments.map((segment, i) => {
    const route = "/" + segments.slice(0, i + 1).join("/");
    const label = routeLabels[route] || decodeURIComponent(segment).replace(/-/g, " ");
    const isLast = i === segments.length - 1;
    return { route, label, isLast };
  });

  if (items.length <= 1) return null;

  return (
    <nav className="flex flex-wrap items-center gap-1 text-xs text-[#8D90A4]" aria-label="Breadcrumb">
      <Link to="/" className="transition-colors hover:text-[#514BFF]">
        Home
      </Link>
      {items.map((item) => (
        <Fragment key={item.route}>
          <ChevronRight className="mx-1 h-3 w-3 text-[#C2C3D0]" />
          {item.isLast ? (
            <span className="font-semibold capitalize text-[#30325F]">{item.label}</span>
          ) : (
            <Link to={item.route} className="capitalize transition-colors hover:text-[#514BFF]">
              {item.label}
            </Link>
          )}
        </Fragment>
      ))}
    </nav>
  );
}
