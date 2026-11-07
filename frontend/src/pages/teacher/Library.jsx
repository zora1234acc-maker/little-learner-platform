import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { BookOpen, Search, Filter } from "lucide-react";

export function TeacherLibrary() {
  const { t } = useTranslation();

  const courses = [
    { id: "c1", title: { en: "Khmer Alphabet", km: "អក្សរខ្មែរ", ar: "حروف اللغة الخميرية" }, subject: "Khmer Language", lessons: 1, quizzes: 1 },
    { id: "c2", title: { en: "Counting 1-10", km: "គណនា 1-10", ar: "العد من 1 إلى 10" }, subject: "Mathematics", lessons: 1, quizzes: 1 },
    { id: "c3", title: { en: "Plants and Animals", km: "ប្រភេទស្លឹងនិងសត្វ", ar: "النباتات والحيوانات" }, subject: "Science", lessons: 1, quizzes: 0 }
  ];

  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");

  const filtered = courses.filter((c) =>
    c.title.en.toLowerCase().includes(search.toLowerCase()) &&
    (subjectFilter === "all" || c.subject === subjectFilter)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-blueberry">Library</h1>
          <p className="text-muted-foreground">Browse published content and assign to students.</p>
        </div>
        <Link to="/teacher/assign" className="px-4 py-2 rounded-lg bg-blueberry text-white font-medium hover:bg-blueberry/90 transition-colors">
          Create Assignment
        </Link>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-blueberry outline-none"
          />
        </div>
        <select
          value={subjectFilter}
          onChange={(e) => setSubjectFilter(e.target.value)}
          className="px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-blueberry outline-none"
        >
          <option value="all">All Subjects</option>
          <option value="Khmer Language">Khmer Language</option>
          <option value="Mathematics">Mathematics</option>
          <option value="Science">Science</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filtered.map((course) => {
          const lang = localStorage.getItem("lang") || "en";
          return (
            <div key={course.id} className="rounded-xl border border-border bg-card p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-blueberry/10 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-blueberry-600" />
                </div>
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Course</span>
              </div>
              <h3 className="font-semibold text-lg text-foreground mb-2">{course.title[lang] || course.title.en}</h3>
              <p className="text-xs text-muted-foreground mb-1">{course.subject}</p>
              <div className="flex gap-2 text-xs text-muted-foreground mb-4">
                <span>{course.lessons} lesson</span>
                <span>{course.quizzes} quiz</span>
              </div>
              <Link to={`/teacher/assign/${course.id}`} className="w-full px-4 py-2 rounded-lg border border-blueberry text-blueberry font-medium text-sm hover:bg-blueberry hover:text-white transition-colors">
                Assign to Students
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
