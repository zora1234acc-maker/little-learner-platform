import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BookOpen, GraduationCap, FileText, Play, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { api } from "@/api/client";

export function AdminContent() {
  const { t } = useTranslation();
  const [counts, setCounts] = useState({ subjects: 0, courses: 0, lessons: 0, quizzes: 0 });

  useEffect(() => {
    Promise.all([
      api.content.subjects.list(),
      api.content.courses.list(),
      api.content.lessons.list(),
      api.content.quizzes.list(),
    ]).then(([subjects, courses, lessons, quizzes]) =>
      setCounts({
        subjects: subjects.data.length,
        courses: courses.data.length,
        lessons: lessons.data.length,
        quizzes: quizzes.data.length,
      })
    );
  }, []);

  const sections = [
    { to: "/admin/content/subjects", label: "Subjects", icon: BookOpen, desc: "Khmer, Math, Science and more", count: `${counts.subjects} subjects` },
    { to: "/admin/content/courses", label: "Courses", icon: GraduationCap, desc: "Group lessons under a subject", count: `${counts.courses} courses` },
    { to: "/admin/content/lessons", label: "Lessons", icon: FileText, desc: "Reading and video lessons", count: `${counts.lessons} lessons` },
    { to: "/admin/content/quizzes", label: "Quizzes", icon: Play, desc: "Multiple-choice questions", count: `${counts.quizzes} quizzes` },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={t("nav.content")}
        title="Content Library"
        description="Admins build the content. Teachers browse the library and assign it to students."
      />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Link key={section.to} to={section.to} className="card-md group">
              <div className="flex items-start justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted/50 text-muted-foreground transition group-hover:bg-blueberry/10 group-hover:text-blueberry">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="rounded-full bg-muted/40 px-2.5 py-1 text-[11px] font-bold text-muted-foreground">{section.count}</span>
              </div>
              <h3 className="mt-4 font-bold text-foreground">{section.label}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{section.desc}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-blueberry">
                Manage <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          );
        })}
      </div>

      <section className="card-md">
        <h3 className="font-bold text-foreground">Content workflow</h3>
        <ol className="mt-3 grid gap-3 text-sm text-muted-foreground sm:grid-cols-4">
          {["Create a subject", "Add a course", "Write lessons", "Attach a quiz"].map((step, index) => (
            <li key={step} className="rounded-xl border border-border bg-background p-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blueberry/10 text-xs font-black text-blueberry">
                {index + 1}
              </span>
              <p className="mt-2 font-bold text-foreground">{step}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
