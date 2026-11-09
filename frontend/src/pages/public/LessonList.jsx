import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, ArrowRight, BookOpen, HelpCircle, Play } from "lucide-react";
import { api } from "@/api/client";
import { useSite } from "@/context/SiteContext";

export function LessonList() {
  const { t } = useTranslation();
  const { lang } = useSite();
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let live = true;
    Promise.all([
      api.content.courses.list(),
      api.content.lessons.list({ course_id: courseId, publishedOnly: true }),
      api.content.quizzes.list({ publishedOnly: true }),
    ]).then(([courseRes, lessonRes, quizRes]) => {
      if (!live) return;
      setCourse(courseRes.data.find((item) => item.id === courseId) || null);
      setLessons(lessonRes.data);
      setQuizzes(quizRes.data);
      setLoading(false);
    });
    return () => {
      live = false;
    };
  }, [courseId]);

  if (loading) {
    return <div className="animate-pulse py-24 text-center text-muted-foreground">{t("common.loading")}</div>;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <Link to={course ? "/subjects" : "/subjects"} className="inline-flex items-center gap-2 text-sm font-bold text-blueberry hover:underline">
        <ArrowLeft className="flip-rtl h-4 w-4" /> {t("nav.subjects")}
      </Link>

      <header>
        <span className="eyebrow">Course</span>
        <h1 className="text-3xl font-black text-blueberry">{course?.title?.[lang] || course?.title?.en || "Lessons"}</h1>
        <p className="mt-2 text-muted-foreground">{course?.description?.[lang] || course?.description?.en}</p>
      </header>

      <div className="space-y-3">
        {lessons.map((lesson, index) => {
          const quiz = quizzes.find((item) => item.lesson_id === lesson.id);
          return (
            <article key={lesson.id} className="card-sm flex flex-wrap items-center gap-3">
              <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${lesson.type === "video" ? "bg-sky/15 text-[#2B6CB0]" : "bg-blueberry/10 text-blueberry"}`}>
                {lesson.type === "video" ? <Play className="h-5 w-5" /> : <BookOpen className="h-5 w-5" />}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-muted-foreground">Lesson {index + 1} · {lesson.type === "video" ? t("home.video") : t("home.reading")}</p>
                <h3 className="truncate font-bold text-foreground">{lesson.title?.[lang] || lesson.title?.en}</h3>
              </div>
              <div className="flex w-full gap-2 sm:w-auto">
                {quiz ? (
                  <Link to={`/quiz/${quiz.id}`} className="btn-ghost min-h-[40px] flex-1 px-3 py-2 text-xs sm:flex-none">
                    <HelpCircle className="h-3.5 w-3.5" /> Quiz
                  </Link>
                ) : null}
                <Link to={`/lesson/${lesson.id}`} className="btn-secondary min-h-[40px] flex-1 px-4 py-2 text-sm sm:flex-none">
                  {t("home.start")} <ArrowRight className="flip-rtl h-3.5 w-3.5" />
                </Link>
              </div>
            </article>
          );
        })}
        {lessons.length === 0 ? <div className="card text-center text-muted-foreground">No lessons in this course yet.</div> : null}
      </div>
    </div>
  );
}
