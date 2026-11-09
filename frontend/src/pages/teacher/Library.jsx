import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { BookOpen, GraduationCap, HelpCircle, Search, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { api } from "@/api/client";
import { useSite } from "@/context/SiteContext";

export function TeacherLibrary() {
  const { t } = useTranslation();
  const { lang } = useSite();
  const [search, setSearch] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [courses, setCourses] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let live = true;
    Promise.all([
      api.content.subjects.list({ publishedOnly: true }),
      api.content.courses.list({ publishedOnly: true }),
      api.content.lessons.list({ publishedOnly: true }),
      api.content.quizzes.list({ publishedOnly: true }),
    ])
      .then(([subjectRes, courseRes, lessonRes, quizRes]) => {
        if (!live) return;
        setSubjects(subjectRes.data);
        setCourses(courseRes.data);
        setLessons(lessonRes.data);
        setQuizzes(quizRes.data);
      })
      .finally(() => live && setLoading(false));
    return () => {
      live = false;
    };
  }, []);

  const text = (field) => (typeof field === "string" ? field : field?.[lang] || field?.en || "");

  const cards = useMemo(
    () =>
      courses.map((course) => {
        const subject = subjects.find((item) => item.id === course.subject_id);
        const courseLessons = lessons.filter((lesson) => lesson.course_id === course.id);
        const courseQuizzes = quizzes.filter((quiz) =>
          courseLessons.some((lesson) => lesson.id === quiz.lesson_id)
        );
        return {
          ...course,
          subjectName: subject ? text(subject.title) : "—",
          lessonCount: courseLessons.length,
          quizCount: courseQuizzes.length,
        };
      }),
    [courses, subjects, lessons, quizzes, lang]
  );

  const filtered = cards.filter((course) => {
    const haystack = `${text(course.title)} ${course.subjectName}`.toLowerCase();
    return haystack.includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={t("nav.library")}
        title="Browse content"
        description="Published subjects, courses, lessons and quizzes. Pick a course to assign work to your students."
        actions={
          <Link to="/teacher/assign" className="btn-primary touch-target">
            Create assignment
          </Link>
        }
      />

      <div className="relative w-full md:w-96">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search courses or subjects..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="input-field ps-10"
        />
      </div>

      {loading ? (
        <div className="animate-pulse py-20 text-center text-muted-foreground">{t("common.loading")}</div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((course) => (
            <article key={course.id} className="card-md flex flex-col border-s-4 border-blueberry">
              <div className="flex items-start justify-between gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blueberry/10 text-blueberry">
                  <GraduationCap className="h-5 w-5" />
                </span>
                <span className="rounded-full bg-muted/40 px-2.5 py-1 text-[11px] font-bold text-muted-foreground">
                  Course
                </span>
              </div>

              <h3 className="mt-3 font-bold text-foreground">{text(course.title)}</h3>
              <p className="mt-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {course.subjectName}
              </p>
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{text(course.description)}</p>

              <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold text-muted-foreground">
                <span className="inline-flex items-center gap-1 rounded-full bg-muted/30 px-2.5 py-1">
                  <BookOpen className="h-3.5 w-3.5" /> {course.lessonCount} lessons
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-muted/30 px-2.5 py-1">
                  <HelpCircle className="h-3.5 w-3.5" /> {course.quizCount} quizzes
                </span>
              </div>

              <Link to={`/teacher/assign/${course.id}`} className="btn-secondary mt-5 w-full min-h-[42px]">
                Assign to students <ArrowRight className="flip-rtl h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 ? (
        <div className="card py-16 text-center text-muted-foreground">
          <BookOpen className="mx-auto mb-3 h-8 w-8" />
          <p>{t("teacher.library.no_courses")}</p>
        </div>
      ) : null}
    </div>
  );
}
