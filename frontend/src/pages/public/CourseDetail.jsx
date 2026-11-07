import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BookOpen } from "lucide-react";

export function CourseDetail() {
  const { t } = useTranslation();
  const { subjectId } = useParams();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const lang = localStorage.getItem("lang") || "en";

  useEffect(() => {
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

  if (loading) {
    return <div className="text-center py-20 text-muted-foreground animate-pulse">{t("common.loading")}</div>;
  }

  return (
    <div className="space-y-6">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/subjects" className="link-primary">{t("nav.subjects")}</Link>
        <span>/</span>
        <span className="text-foreground font-medium">{subject[lang] || subject.en}</span>
      </nav>

      <h1 className="text-2xl font-bold text-blueberry">{subject[lang] || subject.en}</h1>

      {courses.length === 0 ? (
        <div className="py-20 text-center text-muted-foreground">
          <p>No courses available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="card border-l-4 border-mint group">
              <div className="flex items-center gap-3 mb-4">
                <div className="card-icon bg-mint/10 text-mint-600 group-hover:bg-mint transition-colors">
                  <BookOpen className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">Course</span>
              </div>
              <h3 className="font-semibold text-lg text-foreground mb-2">{course.title[lang] || course.title.en}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Learn the basics of {subject[lang] || subject.en} with interactive lessons and quizzes.
              </p>
              <Link to={`/lessons/${course.id}`} className="btn-secondary w-full">
                Start Course <span className="text-xs">→</span>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
