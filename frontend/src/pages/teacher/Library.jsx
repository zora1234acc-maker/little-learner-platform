import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Search, BookOpen } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

export function TeacherLibrary() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const lang = localStorage.getItem("lang") || "en";

  const courses = [
    { id: "c1", title: { en: "Khmer Alphabet", km: "អក្សរខ្មែរ", ar: "حروف اللغة الخميرية" }, subject: "Khmer Language", lessons: 1, quizzes: 1 },
    { id: "c2", title: { en: "Counting 1-10", km: "គណនា 1-10", ar: "العد من 1 إلى 10" }, subject: "Mathematics", lessons: 1, quizzes: 1 },
    { id: "c3", title: { en: "Plants and Animals", km: "ប្រភេទស្លឹងនិងសត្វ", ar: "النباتات والحيوانات" }, subject: "Science", lessons: 1, quizzes: 0 }
  ];

  const filtered = courses.filter((c) =>
    c.title[lang].toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={t("nav.library")}
        title="Browse content"
        description="Browse published content and assign to students."
        actions={
          <Link to="/teacher/assign" className="btn-primary touch-target">
            Create Assignment
          </Link>
        }
      />

      <div className="relative w-full md:w-80 mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-blueberry focus:border-transparent outline-none text-base"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filtered.map((course) => {
          const title = course.title[lang] || course.title.en;
          return (
            <div key={course.id} className="card border-l-4 border-blueberry group hover:border-sunshine transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-blueberry/10 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-blueberry-600" />
                </div>
                <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">Course</span>
              </div>
              <h3 className="font-semibold text-lg text-foreground mb-2">{title}</h3>
              <p className="text-xs text-muted-foreground mb-1">{course.subject}</p>
              <div className="flex gap-2 text-xs text-muted-foreground mb-4">
                <span>{course.lessons} lesson</span>
                <span>{course.quizzes} quiz</span>
              </div>
              <Link to={`/teacher/assign/${course.id}`} className="btn-secondary w-full">
                Assign to Students
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
