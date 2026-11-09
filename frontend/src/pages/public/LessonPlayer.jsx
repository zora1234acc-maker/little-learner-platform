import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, CheckCircle2, HelpCircle, Play } from "lucide-react";
import { api } from "@/api/client";
import { useSite } from "@/context/SiteContext";

export function LessonPlayer() {
  const { t } = useTranslation();
  const { lang } = useSite();
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let live = true;
    Promise.all([api.content.lessons.get(lessonId), api.content.quizzes.list()])
      .then(([lessonRes, quizRes]) => {
        if (!live) return;
        setLesson(lessonRes.data);
        setQuiz(quizRes.data.find((item) => item.lesson_id === lessonId) || null);
      })
      .catch(() => live && setLesson(null))
      .finally(() => live && setLoading(false));
    return () => {
      live = false;
    };
  }, [lessonId]);

  const markComplete = async () => {
    setCompleted(true);
    await api.content.lessons.complete(lessonId);
  };

  if (loading) {
    return <div className="animate-pulse py-24 text-center text-muted-foreground">{t("common.loading")}</div>;
  }

  if (!lesson) {
    return (
      <div className="py-24 text-center">
        <p className="text-muted-foreground">Lesson not found.</p>
        <Link to="/subjects" className="btn-secondary mt-4">{t("nav.subjects")}</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1 rounded-lg border border-border p-2 text-sm font-bold text-muted-foreground hover:bg-accent">
        <ArrowLeft className="flip-rtl h-4 w-4" /> {t("common.back")}
      </button>

      <article className="rounded-[var(--radius-xl)] border border-border bg-white p-6 sm:p-8 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wider text-blueberry/80">
          {lesson.type === "video" ? t("home.video") : t("home.reading")} lesson
        </p>
        <h1 className="mt-2 text-3xl font-black text-blueberry">{lesson.title?.[lang] || lesson.title?.en}</h1>

        {lesson.type === "video" && lesson.video_url ? (
          <div className="mt-5 aspect-video w-full overflow-hidden rounded-[var(--radius-lg)] bg-blueberry/10">
            <iframe src={lesson.video_url} title="Lesson video" allowFullScreen className="h-full w-full" />
          </div>
        ) : null}

        <div
          className="prose prose-sm mt-6 max-w-none leading-relaxed text-foreground/90"
          dangerouslySetInnerHTML={{ __html: lesson.body?.[lang] || lesson.body?.en || "" }}
        />

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
          <span className="text-sm text-muted-foreground">
            {lesson.type === "video" ? t("home.video") : t("home.reading")} · {t("home.start")}
          </span>
          <div className="flex flex-wrap gap-2">
            {quiz ? (
              <Link to={`/quiz/${quiz.id}`} className="btn-secondary min-h-[44px] px-5 py-2.5 text-sm">
                <HelpCircle className="h-4 w-4" /> Take quiz
              </Link>
            ) : null}
            <button onClick={markComplete} disabled={completed} className={`btn-primary min-h-[44px] px-5 py-2.5 text-sm ${completed ? "opacity-60" : ""}`}>
              {completed ? <CheckCircle2 className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {completed ? "Completed!" : "Mark complete"}
            </button>
          </div>
        </div>
      </article>
    </div>
  );
}
