import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BookOpen, GraduationCap, FileText, Play } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

export function AdminContent() {
  const { t } = useTranslation();

  const sections = [
    { to: "/admin/content/subjects", label: t("nav.content"), icon: <BookOpen className="w-4 h-4" />, desc: "Create subjects (Khmer, Math, Science)" },
    { to: "/admin/content/courses", label: "Courses", icon: <GraduationCap className="w-4 h-4" />, desc: "Build courses under subjects" },
    { to: "/admin/content/lessons", label: "Lessons", icon: <FileText className="w-4 h-4" />, desc: "Reading & video lessons" },
    { to: "/admin/content/quizzes", label: "Quizzes", icon: <Play className="w-4 h-4" />, desc: "Multiple-choice quizzes" }
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
          <Link key={s.to} to={s.to} className="card group hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground group-hover:bg-blueberry/10 group-hover:text-blueberry transition-colors">
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
