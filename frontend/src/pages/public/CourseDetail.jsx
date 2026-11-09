import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, BookOpen, ArrowRight } from "lucide-react";
import { api } from "@/api/client";
import { useSite } from "@/context/SiteContext";

export function CourseDetail() {
  const { t } = useTranslation();
  const { lang } = useSite();
  const { subjectId } = useParams();
  const [subject, setSubject] = useState(null);
  const [courses, setCourses] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let live = true;
    Promise.all([
      api.content.subjects.list(),
      api.content.courses.list({ subject_id: subjectId, publishedOnly: true }),
      api.content.lessons.list({ publishedOnly: true }),
    ]).then(([subjectRes, courseRes, lessonRes]) => {
      if (!live) return;
      setSubject(subjectRes.data.find((item) => item.id === subjectId) || null);
      setCourses(courseRes.data);
      setLessons(lessonRes.data);
      setLoading(false);
    });
    return () => {
      live = false;
    };
  }, [subjectId]);

  if (loading) {
    return <div className="animate-pulse py-24 text-center text-muted-foreground">{t("common.loading")}</div>;
  }

  if (!subject) {
    return (
      <div className="py-24 text-center">
        <p className="text-muted-foreground">Subject not found.</p>
        <Link to="/subjects" className="btn-secondary mt-4">
          {t("nav.subjects")}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <nav className="flex items-center gap-2 text-sm">
        <Link to="/subjects" className="link-primary">
          {t("nav.subjects")}
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="font-medium text-foreground">{subject.title?.[lang] || subject.title?.en}</span>
      </nav>

      <header>
        <span className="eyebrow">{t("home.featured")}</span>
        <h1 className="text-3xl font-black text-blueberry sm:text-4xl">{subject.title?.[lang] || subject.title?.en}</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">{subject.description?.[lang] || subject.description?.en}</p>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {courses.map((course, index) => {
          const courseLessons = lessons.filter((lesson) => lesson.course_id === course.id);
          const colors = ["border-blueberry", "border-sunshine", "border-mint"];
          return (
            <article key={course.id} className={`card-md border-s-4 ${colors[index % colors.length]}`}>
              <div className="mb-5 flex items-center justify-between">
                <span className="icon-md bg-mint/10 text-[#16735D]">
                  <BookOpen className="h-5 w-5" />
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Course</span>
              </div>
              <h3 className="text-lg font-bold text-foreground">{course.title?.[lang] || course.title?.en}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{course.description?.[lang] || course.description?.en}</p>
              <p className="mt-3 text-xs font-bold text-muted-foreground">{courseLessons.length} lesson{courseLessons.length === 1 ? "" : "s"}</p>
              <Link to={`/courses/${course.id}/lessons`} className="btn-secondary mt-5 w-full">
                {t("home.start")} <ArrowRight className="flip-rtl h-4 w-4" />
              </Link>
            </article>
          );
        })}
      </div>

      {courses.length === 0 ? (
        <div className="card text-center text-muted-foreground">Courses for this subject are being prepared.</div>
      ) : null}

      <Link to="/subjects" className="inline-flex items-center gap-2 text-sm font-bold text-blueberry hover:underline">
        <ArrowLeft className="flip-rtl h-4 w-4" /> {t("nav.subjects")}
      </Link>
    </div>
  );
}
