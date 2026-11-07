import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BookOpen, Play, ArrowRight } from "lucide-react";

export function CourseDetail() {
  const { t } = useTranslation();
  const { subjectId } = useParams();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Filter courses by subject_id
    const allCourses = [
      { id: "c1", subject_id: "sub1", title: { en: "Khmer Alphabet", km: "អក្សរខ្មែរ", ar: "حروف اللغة الخميرية" }, position: 1 },
      { id: "c2", subject_id: "sub2", title: { en: "Counting 1-10", km: "គណនា 1-10", ar: "العد من 1 إلى 10" }, position: 1 },
      { id: "c3", subject_id: "sub3", title: { en: "Plants and Animals", km: "ប្រភេទស្លឹងនិងសត្វ", ar: "النباتات والحيوانات" }, position: 1 }
    ];
    setCourses(allCourses.filter((c) => c.subject_id === subjectId));
    setLoading(false);
  }, [subjectId]);

  const subjectNames = {
    sub1: { en: "Khmer Language", km: "ភាសាខ្មែរ", ar: "اللغة الخميرية" },
    sub2: { en: "Mathematics", km: "គណិតវិជ្ជា", ar: "الرياضيات" },
    sub3: { en: "Science", km: "វិទ្យាសាស្ត្រ", ar: "العلوم" }
  };

  const subject = subjectNames[subjectId] || subjectNames.sub1;
  const lang = localStorage.getItem("lang") || "en";

  return (
    <div className="space-y-6">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/subjects" className="hover:text-foreground">{t("nav.subjects")}</Link>
        <span className="text-xs">/</span>
        <span className="text-foreground font-medium">{subject[lang] || subject.en}</span>
      </nav>

      <h1 className="text-2xl font-bold text-blueberry">{subject[lang] || subject.en}</h1>

      {loading ? (
        <div className="text-center py-20 text-muted-foreground animate-pulse">{t("common.loading")}</div>
      ) : courses.length === 0 ? (
        <div className="text-center py-20">{t("common.error")}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="rounded-xl border border-border bg-card p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-sunshine/10 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-sunshine" />
                </div>
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Course</span>
              </div>
              <h3 className="font-semibold text-lg text-foreground mb-2">{course.title[lang] || course.title.en}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {course.subject_id === "sub1" ? (t("nav.subjects")) : ""}
                Learn the basics of {subject[lang] || subject.en}
              </p>
              <Link to={`/lessons/${course.id}`} className="inline-flex items-center gap-1 w-full justify-center px-4 py-2 rounded-lg bg-blueberry text-white font-medium text-sm hover:bg-blueberry/90 transition-colors">
                Start Course <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
