import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Users, GraduationCap, FileText, Mail, ShieldAlert } from "lucide-react";

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
    { to: "/admin/cms", label: "Website CMS", icon: <ShieldAlert className="w-4 h-4" /> },
    { to: "/admin/grading", label: "Grading Queue", icon: <FileText className="w-4 h-4" /> }
  ];

  return (
    <div className="space-y-8">
      <div>
        <span className="eyebrow">Admin Dashboard</span>
        <h1 className="text-2xl font-bold text-blueberry">Manage the platform</h1>
        <p className="text-muted-foreground">Users, content, and website settings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="card border-l-4 border-blueberry">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">{stat.label}</span>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              </div>
              <div className={`p-2 rounded-lg ${stat.color.replace("text-", "bg-")}/10 ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <h3 className="font-semibold text-lg text-foreground mb-4">Quick actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map((link) => (
            <Link key={link.to} to={link.to} className="flex flex-col items-start gap-2 p-4 rounded-xl border border-border hover:bg-accent transition-colors text-sm font-medium text-foreground">
              {link.icon} {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
