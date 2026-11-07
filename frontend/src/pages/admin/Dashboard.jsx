import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Users, GraduationCap, FileText, Layout, Mail, ShieldAlert } from "lucide-react";

export function AdminDashboard() {
  const { t } = useTranslation();

  const stats = [
    { label: "Users", value: "4", icon: <Users className="w-5 h-5" />, color: "text-blueberry" },
    { label: "Courses", value: "3", icon: <GraduationCap className="w-5 h-5" />, color: "text-sunshine" },
    { label: "Lessons", value: "3", icon: <FileText className="w-5 h-5" />, color: "text-mint-600" },
    { label: "Pending Grades", value: "1", icon: <Mail className="w-5 h-5" />, color: "text-bubblegum" }
  ];

  const quickLinks = [
    { to: "/admin/users", label: "Manage Users", icon: <Users className="w-4 h-4" /> },
    { to: "/admin/content", label: "Content Library", icon: <GraduationCap className="w-4 h-4" /> },
    { to: "/admin/cms", label: "Website CMS", icon: <Layout className="w-4 h-4" /> },
    { to: "/admin/grading", label: "Grading Queue", icon: <FileText className="w-4 h-4" /> }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-blueberry">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage users, content, and the website.</p>
        </div>
        <Link to="/admin/content" className="px-4 py-2 rounded-lg bg-blueberry text-white font-medium hover:bg-blueberry/90 transition-colors">
          Add Content
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
              <div className={`p-2 rounded-lg ${stat.color.replace("text-", "bg-")}/10 ${stat.color}`}>{stat.icon}</div>
            </div>
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="font-semibold text-lg text-foreground mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {quickLinks.map((link) => (
            <Link key={link.to} to={link.to} className="flex flex-col items-center gap-2 p-3 rounded-lg border border-border hover:bg-accent hover:border-blueberry transition-colors text-sm font-medium text-foreground">
              {link.icon} {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
