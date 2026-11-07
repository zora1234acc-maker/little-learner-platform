import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BookOpen, GraduationCap, FileText, Play } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

export function AdminContent() {
  const { t } = useTranslation();

  const sections = [
    { to: "/admin/content/subjects", label: t("nav.content"), icon: <BookOpen className="w-4 h-4" />, desc: "Create subjects (Khmer, Math, Science)", color: "border-blueberry" },
    { to: "/admin/content/courses", label: "Courses", icon: <GraduationCap className="w-4 h-4" />, desc: "Build courses under subjects", color: "border-sunshine" },
    { to: "/admin/content/lessons", label: "Lessons", icon: <FileText className="w-4 h-4" />, desc: "Reading & video lessons", color: "border-mint" },
    { to: "/admin/content/quizzes", label: "Quizzes", icon: <Play className="w-4 h-4" />, desc: "Multiple-choice quizzes", color: "border-sky" }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={t("nav.content")}
        title="Content Library"
        description="Admin builds content. Teachers browse and assign."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {sections.map((s) => (
          <Link key={s.to} to={s.to} className="card group border-l-4 border-blueberry hover:border-sunshine transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${s.color.replace("border-", "bg-")}/10 text-blueberry group-hover:bg-sunshine transition-colors`}>
                {s.icon}
              </div>
            </div>
            <h3 className="font-semibold text-foreground mb-1">{s.label}</h3>
            <p className="text-xs text-muted-foreground">{s.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
