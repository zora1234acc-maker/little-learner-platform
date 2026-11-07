import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BookOpen, Play } from "lucide-react";

export function LessonList() {
  const { t } = useTranslation();
  const { courseId } = useParams();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const lang = localStorage.getItem("lang") || "en";

  useEffect(() => {
    const allLessons = [
      { id: "l1", course_id: "c1", title: { en: "First Consonant: ក", km: "អក្សរដើម៖ ក", ar: "أول حرف ساكن: كه" }, type: "reading", position: 1 },
      { id: "l2", course_id: "c2", title: { en: "Counting 1 to 5", km: "គណនា 1 ដល់ 5", ar: "العد من 1 إلى 5" }, type: "video", position: 1 },
      { id: "l3", course_id: "c3", title: { en: "Parts of a Plant", km: "បច្ចុប្បន្នភាពរបស់ស្លឹង", ar: "أجزاء النبات" }, type: "reading", position: 1 }
    ];
    setLessons(allLessons.filter((l) => l.course_id === courseId));
    setLoading(false);
  }, [courseId]);

  if (loading) {
    return <div className="text-center py-20 text-muted-foreground animate-pulse">{t("common.loading")}</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-blueberry">{t("nav.subjects")}</h1>

      <div className="space-y-4">
        {lessons.map((lesson) => (
          <div
            key={lesson.id}
            className="flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:shadow-sm transition-shadow group cursor-pointer"
            onClick={() => {}}
          >
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${lesson.type === "video" ? "bg-sky/10 text-sky-600" : "bg-blueberry/10 text-blueberry-600"}`}>
                {lesson.type === "video" ? <Play className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{lesson.title[lang] || lesson.title.en}</h3>
                <p className="text-xs text-muted-foreground">{lesson.type === "video" ? "Video lesson" : "Reading lesson"}</p>
              </div>
            </div>
            <Link to={`/lesson/${lesson.id}`} className="btn-secondary">
              Start
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
