import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Award, BookOpen, CheckCircle2, Clock, Flame, HelpCircle, LockKeyhole, Star, Target, Trophy } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { api } from "@/api/client";
import { useAuth } from "@/context/AuthContext";
import { useSite } from "@/context/SiteContext";

const doneStatuses = ["completed", "graded", "submitted"];

export function StudentProgress() {
  const { t } = useTranslation();
  const { lang } = useSite();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [content, setContent] = useState({
    lessons: {},
    quizzes: {},
    courses: {},
    subjects: {},
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let live = true;
    Promise.all([
      api.progress.student(user.id),
      api.content.subjects.list(),
      api.content.courses.list(),
      api.content.lessons.list(),
      api.content.quizzes.list(),
    ])
      .then(([progressRes, subjectRes, courseRes, lessonRes, quizRes]) => {
        if (!live) return;
        setData(progressRes.data);
        setContent({
          lessons: Object.fromEntries(lessonRes.data.map((item) => [item.id, item])),
          quizzes: Object.fromEntries(quizRes.data.map((item) => [item.id, item])),
          courses: Object.fromEntries(courseRes.data.map((item) => [item.id, item])),
          subjects: Object.fromEntries(subjectRes.data.map((item) => [item.id, item])),
        });
      })
      .finally(() => live && setLoading(false));
    return () => {
      live = false;
    };
  }, [user.id]);

  const text = (field) => (typeof field === "string" ? field : field?.[lang] || field?.en || "");

  const subjectForItem = (item) => {
    if (item.item_type === "lesson") {
      const lesson = content.lessons[item.item_id];
      const course = lesson ? content.courses[lesson.course_id] : null;
      return course?.subject_id || null;
    }
    if (item.item_type === "quiz") {
      const quiz = content.quizzes[item.item_id];
      const lesson = quiz ? content.lessons[quiz.lesson_id] : null;
      const course = lesson ? content.courses[lesson.course_id] : null;
      return course?.subject_id || null;
    }
    return null;
  };

  const groups = useMemo(() => {
    if (!data) return [];
    const bucket = new Map();

    (data.items || []).forEach((item) => {
      const subjectId = subjectForItem(item) || "other";
      const label =
        subjectId === "other"
          ? "Other work"
          : text(content.subjects[subjectId]?.title) || "Subject";
      const entry = bucket.get(subjectId) || { id: subjectId, label, total: 0, completed: 0, scores: [] };
      entry.total += 1;
      const done = doneStatuses.includes(item.status) || item.score !== null;
      if (done) entry.completed += 1;
      if (item.score !== null && item.score !== undefined) entry.scores.push(item.score);
      bucket.set(subjectId, entry);
    });

    return Array.from(bucket.values()).map((entry) => ({
      ...entry,
      average: entry.scores.length
        ? Math.round(entry.scores.reduce((sum, score) => sum + score, 0) / entry.scores.length)
        : 0,
    }));
  }, [data, content, lang]);

  if (loading) {
    return <div className="animate-pulse py-24 text-center text-muted-foreground">{t("common.loading")}</div>;
  }

  const stats = data?.stats || { total: 0, completed: 0, overdue: 0, avgScore: 0 };
  const completionPercent = stats.total ? Math.round((stats.completed / stats.total) * 100) : 0;
  const badges = [
    { title: "First step", description: "Complete your first activity", icon: Star, earned: stats.completed >= 1 },
    { title: "On a roll", description: "Complete three activities", icon: Flame, earned: stats.completed >= 3 },
    { title: "Quiz star", description: "Reach 80% average score", icon: Trophy, earned: stats.avgScore >= 80 },
    { title: "Learning champion", description: "Complete every assigned activity", icon: Award, earned: stats.total > 0 && completionPercent === 100 },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={t("nav.classProgress")}
        title="My progress"
        description="See what you have completed and how you scored."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="card-md">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("student.progress.assignments")}</span>
          <div className="mt-1 text-3xl font-black text-foreground">{stats.total}</div>
        </div>
        <div className="card-md">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("student.progress.completed")}</span>
          <div className="mt-1 flex items-center gap-2 text-3xl font-black text-[#16735D]">
            {stats.completed}
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>
        <div className="card-md">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("student.progress.average_score")}</span>
          <div className="mt-1 text-3xl font-black text-blueberry">{stats.avgScore}%</div>
        </div>
        <div className="card-md">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("student.progress.overdue")}</span>
          <div className="mt-1 flex items-center gap-2 text-3xl font-black text-bubblegum">
            {stats.overdue}
            <Clock className="h-5 w-5" />
          </div>
        </div>
      </div>

      <section className="overflow-hidden rounded-[1.75rem] bg-[#30325F] p-6 text-white shadow-[0_18px_40px_-28px_rgba(48,50,95,0.8)] sm:p-8">
        <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#A9EEDC]">
              <Target className="h-4 w-4" /> Learning journey
            </div>
            <h2 className="mt-3 text-2xl font-extrabold sm:text-3xl">{t("student.progress.keep_moving")}</h2>
            <p className="mt-2 text-sm leading-7 text-white/70">
              You have completed {stats.completed} of {stats.total} activities. Every small step counts.
            </p>
          </div>
          <div className="w-full max-w-sm">
            <div className="mb-2 flex items-center justify-between text-sm font-bold">
              <span>{t("student.progress.journey_progress")}</span>
              <span className="text-[#FFD75E]">{completionPercent}%</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-white/15">
              <div className="h-full rounded-full bg-[#FFD75E] transition-all" style={{ width: `${completionPercent}%` }} />
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#8D90A4]">{t("student.progress.achievements")}</span>
            <h2 className="mt-1 text-2xl font-extrabold text-[#30325F]">{t("student.progress.badges")}</h2>
          </div>
          <span className="text-sm font-bold text-[#777A91]">{badges.filter((badge) => badge.earned).length}/{badges.length} {t("common.earned")}</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {badges.map((badge) => {
            const Icon = badge.icon;
            return (
              <article key={badge.title} className={`rounded-2xl border p-4 ${badge.earned ? "border-[#DCD7FF] bg-[#F7F6FF]" : "border-[#E7E8F0] bg-white opacity-65"}`}>
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${badge.earned ? "bg-[#FFD75E] text-[#6D5714]" : "bg-[#F0F1F5] text-[#A0A2B4]"}`}>
                  {badge.earned ? <Icon className="h-5 w-5" /> : <LockKeyhole className="h-5 w-5" />}
                </div>
                <h3 className="mt-4 font-extrabold text-[#30325F]">{badge.title}</h3>
                <p className="mt-1 text-xs leading-5 text-[#777A91]">{badge.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <div className="card-md overflow-hidden p-0">
        <div className="border-b border-border px-4 py-3">
          <h2 className="font-bold text-foreground">{t("student.progress.by_subject")}</h2>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-bold">{t("student.progress.subject")}</th>
              <th className="px-4 py-3 text-center font-bold">{t("student.progress.progress_col")}</th>
              <th className="px-4 py-3 text-center font-bold">{t("student.progress.score_col")}</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((group) => {
              const percent = group.total ? Math.round((group.completed / group.total) * 100) : 0;
              return (
                <tr key={group.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-bold text-foreground">{group.label}</td>
                  <td className="px-4 py-3">
                    <div className="mx-auto w-40">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                          {group.completed}/{group.total}
                        </span>
                        <span>{percent}%</span>
                      </div>
                      <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted/40">
                        <div className="h-full rounded-full bg-blueberry" style={{ width: `${percent}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`font-bold ${
                        group.average >= 70 ? "text-[#16735D]" : "text-muted-foreground"
                      }`}
                    >
                      {group.average ? `${group.average}%` : "—"}
                    </span>
                  </td>
                </tr>
              );
            })}
            {groups.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-10 text-center text-muted-foreground">
                  No progress yet. Start an assignment from your to-do list.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div>
        <h2 className="mb-3 text-lg font-bold text-foreground">{t("student.progress.recent_work")}</h2>
        <div className="space-y-2">
          {(data?.items || []).map((item) => {
            const done = doneStatuses.includes(item.status) || item.score !== null;
            const Icon = item.item_type === "quiz" ? HelpCircle : BookOpen;
            const href =
              item.item_type === "lesson"
                ? `/lesson/${item.item_id}`
                : item.item_type === "quiz"
                ? `/quiz/${item.item_id}`
                : `/student/assign/${item.id}`;
            return (
              <Link
                key={item.id}
                to={href}
                className="card-sm flex items-center gap-3 transition hover:border-blueberry/30"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted/40 text-muted-foreground">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold text-foreground">
                    {text(item.title)}
                  </span>
                  <span className="block text-xs capitalize text-muted-foreground">
                    {item.item_type} · {done ? "done" : (item.status || "not started").replace(/_/g, " ")}
                  </span>
                </span>
                {item.score !== null && item.score !== undefined ? (
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-black ${
                      item.score >= 70 ? "bg-mint/15 text-[#16735D]" : "bg-bubblegum/15 text-bubblegum"
                    }`}
                  >
                    {item.score}%
                  </span>
                ) : null}
              </Link>
            );
          })}
          {(data?.items || []).length === 0 ? (
            <p className="card text-center text-muted-foreground">{t("common.nothing_here")}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
