import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

export function LessonPlayer() {
  const { t } = useTranslation();
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const lang = localStorage.getItem("lang") || "en";

  useEffect(() => {
    const allLessons = {
      l1: { id: "l1", title: { en: "First Consonant: ក", km: "អក្សរដើម៖ ក", ar: "أول حرف ساكن: كه" }, type: "reading", body: { en: "<p>This is the first Khmer consonant <strong>ក</strong> (ka). It makes the 'k' sound like in 'kite'.</p><p>Practice writing it: start at the top, curve down and around.</p>", km: "<p>នេះជាអក្សរដើមដែលមានអាណត្តិទិន <strong>ក</strong> (ka). វាប្អូនសម្រាប់ការអាន 'ក' ជាមូល 'កាយ៉ីតេ'។</p>", ar: "<p>هذا أول حرف ساكن خميري <strong>كه</strong> (ka). يُنطق como 'ك' كما في 'kit'.</p>" } },
      l2: { id: "l2", title: { en: "Counting 1 to 5", km: "គណនា 1 ដល់ 5", ar: "العد من 1 إلى 5" }, type: "video", body: { en: "<p>Let's count together! 1, 2, 3, 4, 5.</p>", km: "<p>អ្នកនឹងគណនាជានឹងគ្នា! 1, 2, 3, 4, 5.</p>", ar: "<p>لنعد معًا! 1، 2، 3، 4، 5.</p>" }, video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
      l3: { id: "l3", title: { en: "Parts of a Plant", km: "បច្ចុប្បន្នភាពរបស់ស្លឹង", ar: "أجزاء النبات" }, type: "reading", body: { en: "<p>A plant has roots, a stem, leaves and flowers.</p>", km: "<p>ស្លឹងមានរង្វាន់។ ធ្លាប់។ បញ្ចេញ។ និងផ្កា។</p>", ar: "<p>للنبات جذور، وسيقان، وأوراق وأزهار.</p>" } }
    };
    setLesson(allLessons[lessonId]);
    setLoading(false);
  }, [lessonId]);

  const markComplete = async () => {
    setCompleted(true);
    await new Promise((r) => setTimeout(r, 500));
  };

  if (loading || !lesson) {
    return <div className="text-center py-20 text-muted-foreground animate-pulse">{t("common.loading")}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <nav className="flex items-center gap-2">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 p-2 rounded-lg border border-border hover:bg-accent">
          <ArrowLeft className="w-4 h-4" /> {t("common.back")}
        </button>
      </nav>

      <div className="rounded-xl border border-border bg-card p-6">
        <h1 className="text-2xl font-bold text-blueberry mb-4">{lesson.title[lang] || lesson.title.en}</h1>
        {lesson.type === "video" && lesson.video_url ? (
          <div className="aspect-video w-full rounded-xl bg-muted overflow-hidden mb-4">
            <iframe src={lesson.video_url} title="Lesson video" allowFullScreen className="w-full h-full" />
          </div>
        ) : null}
        <div className="prose prose-sm max-w-none text-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: lesson.body[lang] || lesson.body.en }} />
        <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{lesson.type === "video" ? "Video lesson" : "Reading lesson"}</span>
          <button
            onClick={markComplete}
            disabled={completed}
            className={`px-6 py-3 rounded-lg font-medium text-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${completed ? "bg-mint text-mint-foreground" : "bg-blueberry text-white hover:bg-blueberry/90"} touch-target`}
          >
            {completed ? <CheckCircle2 className="w-4 h-4 mr-2" /> : ""} {completed ? "Completed!" : "Mark Complete"}
          </button>
        </div>
      </div>
    </div>
  );
}
