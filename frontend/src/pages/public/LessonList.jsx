import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Play, BookOpen } from "lucide-react";

export function LessonList() {
  const { t } = useTranslation();
  const { courseId } = useParams();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const allLessons = [
      { id: "l1", course_id: "c1", title: { en: "First Consonant: ក", km: "អក្សរដើម៖ ក", ar: "أول حرف ساكن: كه" }, type: "reading", position: 1 },
      { id: "l2", course_id: "c2", title: { en: "Counting 1 to 5", km: "គណនា 1 ដល់ 5", ar: "العد من 1 إلى 5" }, type: "video", position: 1 },
      { id: "l3", course_id: "c3", title: { en: "Parts of a Plant", km: "បច្ចុប្បន្នភាពរបស់ស្លឹង", ar: "أجزاء النبات" }, type: "reading", position: 1 }
    ];
    setLessons(allLessons.filter((l) => l.course_id === courseId));
    setLoading(false);
  }, [courseId]);

  const lang = localStorage.getItem("lang") || "en";

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-blueberry">{t("nav.subjects")}</h1>

      {loading ? (
        <div className="text-center py-20 text-muted-foreground animate-pulse">{t("common.loading")}</div>
      ) : (
        <div className="space-y-4">
          {lessons.map((lesson) => (
            <div key={lesson.id} className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:bg-accent/5 transition-colors cursor-pointer" onClick={() => {}}>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${lesson.type === "video" ? "bg-sky-50 text-sky-600" : "bg-blueberry-50 text-blueberry-600"}`}>
                {lesson.type === "video" ? <Play className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{lesson.title[lang] || lesson.title.en}</h3>
                <p className="text-xs text-muted-foreground">{lesson.type === "video" ? "Video lesson" : "Reading lesson"}</p>
              </div>
              <Link to={`/lesson/${lesson.id}`} className="px-4 py-2 rounded-lg border border-blueberry text-blueberry font-medium text-sm hover:bg-blueberry hover:text-white transition-colors">
                {t("common.back")}
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
