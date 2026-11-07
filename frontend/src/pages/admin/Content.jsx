import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { BookOpen, Layout, Play, FileText } from "lucide-react";

export function AdminContent() {
  const { t } = useTranslation();

  const sections = [
    { to: "/admin/content/subjects", label: "Subjects", icon: <BookOpen className="w-4 h-4" />, desc: "Create subjects (Khmer, Math, Science)" },
    { to: "/admin/content/courses", label: "Courses", icon: <GraduationCap className="w-4 h-4" />, desc: "Build courses under subjects" },
    { to: "/admin/content/lessons", label: "Lessons", icon: <FileText className="w-4 h-4" />, desc: "Reading & video lessons" },
    { to: "/admin/content/quizzes", label: "Quizzes", icon: <Play className="w-4 h-4" />, desc: "Multiple-choice quizzes" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-blueberry">Content Library</h1>
        <p className="text-muted-foreground">Admin builds content. Teachers browse and assign.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {sections.map((s) => (
          <Link key={s.to} to={s.to} className="flex flex-col p-5 rounded-xl border border-border bg-card hover:shadow-md transition-all group">
            <div className="w-12 h-12 rounded-xl bg-blueberry/10 flex items-center justify-center mb-3 group-hover:bg-blueberry transition-colors">
              {s.icon}
            </div>
            <h3 className="font-semibold text-foreground mb-1">{s.label}</h3>
            <p className="text-xs text-muted-foreground">{s.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

import { GraduationCap } from "lucide-react";
