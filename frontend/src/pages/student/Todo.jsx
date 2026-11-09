import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, CheckCircle2, Clock, HelpCircle, Play } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { api } from "@/api/client";
import { useAuth } from "@/context/AuthContext";
import { useSite } from "@/context/SiteContext";

const statusStyles = {
  not_started: "border-border bg-muted/30 text-muted-foreground",
  in_progress: "border-sunshine/30 bg-sunshine/15 text-[#8A6200]",
  submitted: "border-sky/30 bg-sky/10 text-[#2B6CB0]",
  completed: "border-mint/30 bg-mint/10 text-[#16735D]",
  graded: "border-mint/30 bg-mint/10 text-[#16735D]",
};

const statusLabel = (status) => (status || "not_started").replace(/_/g, " ");

export function StudentTodo() {
  const { t } = useTranslation();
  const { lang } = useSite();
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    let live = true;
    api.assignments.targets
      .list({ studentId: user.id })
      .then((result) => live && setItems(result.data))
      .finally(() => live && setLoading(false));
    return () => {
      live = false;
    };
  }, [user.id]);

  const text = (field) => (typeof field === "string" ? field : field?.[lang] || field?.en || "");
  const isDone = (item) => ["completed", "graded", "submitted"].includes(item.status);

  const filtered = useMemo(() => {
    if (filter === "todo") return items.filter((item) => !isDone(item));
    if (filter === "done") return items.filter(isDone);
    return items;
  }, [items, filter]);

  const todoCount = items.filter((item) => !isDone(item)).length;
  const doneCount = items.length - todoCount;

  const linkFor = (item) => {
    if (item.item_type === "lesson") return `/lesson/${item.item_id}`;
    if (item.item_type === "quiz") return `/quiz/${item.item_id}`;
    return `/student/assign/${item.id}`;
  };

  const iconFor = (type) => {
    if (type === "lesson") return Play;
    if (type === "quiz") return HelpCircle;
    return BookOpen;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={t("nav.library")}
        title="My to-do"
        description="Lessons, quizzes and assignments your teacher sent you."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="card-md">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("student.todo.total")}</span>
          <div className="mt-1 text-3xl font-black text-foreground">{items.length}</div>
        </div>
        <div className="card-md">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("student.todo.todo")}</span>
          <div className="mt-1 text-3xl font-black text-blueberry">{todoCount}</div>
        </div>
        <div className="card-md">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("student.todo.done")}</span>
          <div className="mt-1 text-3xl font-black text-[#16735D]">{doneCount}</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          { id: "all", label: t("student.todo.all") },
          { id: "todo", label: `${t("student.todo.todo")} (${todoCount})` },
          { id: "done", label: `${t("student.todo.done")} (${doneCount})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`min-h-[42px] rounded-xl px-4 text-sm font-bold ${
              filter === tab.id
                ? "bg-blueberry text-white"
                : "border border-border bg-card text-muted-foreground hover:bg-accent"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((item) => {
          const Icon = iconFor(item.item_type);
          const done = isDone(item);
          return (
            <article
              key={item.id}
              className="card-sm flex flex-wrap items-center gap-3 sm:flex-nowrap"
            >
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                  item.item_type === "lesson"
                    ? "bg-blueberry/10 text-blueberry"
                    : item.item_type === "quiz"
                    ? "bg-sunshine/25 text-[#8A6200]"
                    : "bg-sky/15 text-[#2B6CB0]"
                }`}
              >
                <Icon className="h-5 w-5" />
              </span>

              <div className="min-w-0 flex-1">
                <h3 className="truncate font-bold text-foreground">{text(item.title)}</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  <span className="capitalize">{item.item_type}</span>
                  {item.due_date ? ` · Due ${new Date(item.due_date).toLocaleDateString()}` : ""}
                  {done && item.score !== null && item.score !== undefined ? ` · Score ${item.score}%` : ""}
                </p>
              </div>

              <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-end">
                <span
                  className={`rounded-full border px-2.5 py-1 text-[11px] font-bold capitalize ${
                    item.is_overdue && !done
                      ? "border-bubblegum/30 bg-bubblegum/10 text-bubblegum"
                      : statusStyles[item.status] || statusStyles.not_started
                  }`}
                >
                  {item.is_overdue && !done ? "overdue" : statusLabel(item.status)}
                </span>

                <Link
                  to={linkFor(item)}
                  className={`${done ? "btn-ghost" : "btn-secondary"} min-h-[40px] px-4 py-2 text-sm`}
                >
                  {done ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" /> Review
                    </>
                  ) : (
                    <>
                      Start <ArrowRight className="flip-rtl h-4 w-4" />
                    </>
                  )}
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      {!loading && filtered.length === 0 ? (
        <div className="card py-16 text-center text-muted-foreground">
          {filter === "todo" ? (
            <>
              <CheckCircle2 className="mx-auto mb-3 h-8 w-8 text-[#16735D]" />
              <p>{t("student.todo.everything_done")}</p>
            </>
          ) : (
            <>
              <Clock className="mx-auto mb-3 h-8 w-8" />
              <p>{t("student.todo.no_assignments")}</p>
            </>
          )}
        </div>
      ) : null}

      {loading ? <p className="text-center text-sm text-muted-foreground">{t("student.todo.loading")}</p> : null}
    </div>
  );
}
