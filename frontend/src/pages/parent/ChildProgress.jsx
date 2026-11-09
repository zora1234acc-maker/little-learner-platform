import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, BookOpen, CheckCircle2, Clock, HelpCircle, Mail, TrendingUp, Target, Award } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Avatar } from "@/components/Avatar";
import { api } from "@/api/client";
import { useSite } from "@/context/SiteContext";

const statusStyles = {
  not_started: "border-border bg-muted/30 text-muted-foreground",
  in_progress: "border-sunshine/30 bg-sunshine/15 text-[#8A6200]",
  submitted: "border-sky/30 bg-sky/10 text-[#2B6CB0]",
  completed: "border-mint/30 bg-mint/10 text-[#16735D]",
  graded: "border-mint/30 bg-mint/10 text-[#16735D]",
};

export function ParentChildProgress() {
  const { t } = useTranslation();
  const { lang } = useSite();
  const { childId } = useParams();

  const [child, setChild] = useState(null);
  const [snapshot, setSnapshot] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let live = true;
    Promise.all([api.users.get(childId), api.progress.student(childId)])
      .then(([userRes, progressRes]) => {
        if (!live) return;
        setChild(userRes.data);
        setSnapshot(progressRes.data);
      })
      .catch(() => {})
      .finally(() => live && setLoading(false));
    return () => {
      live = false;
    };
  }, [childId]);

  const text = (field) => (typeof field === "string" ? field : field?.[lang] || field?.en || "");

  if (loading) {
    return <div className="animate-pulse py-24 text-center text-muted-foreground">{t("common.loading")}</div>;
  }

  if (!child || !snapshot) {
    return (
      <div className="mx-auto max-w-md py-20 text-center">
        <p className="text-muted-foreground">{t("parent.child_progress.child_not_found")}</p>
        <Link to="/parent" className="btn-secondary mt-4">
          <ArrowLeft className="flip-rtl h-4 w-4" /> {t("common.back")}
        </Link>
      </div>
    );
  }

  const stats = snapshot.stats || { total: 0, completed: 0, overdue: 0, avgScore: 0 };
  const completionPercent = stats.total ? Math.round((stats.completed / stats.total) * 100) : 0;
  const completedItems = (snapshot.items || []).filter((item) => ["completed", "graded", "submitted"].includes(item.status) || item.score !== null);
  const needsAttention = (snapshot.items || []).filter((item) => item.is_overdue && !["completed", "graded", "submitted"].includes(item.status));

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <nav className="flex items-center gap-2">
        <Link
          to="/parent"
          className="inline-flex items-center gap-1 rounded-lg border border-border p-2 text-sm font-bold text-muted-foreground hover:bg-accent"
        >
          <ArrowLeft className="flip-rtl h-4 w-4" /> {t("common.back")}
        </Link>
      </nav>

      <div className="card-md">
        <div className="flex flex-wrap items-center gap-4">
          <Avatar src={child.avatar_url} name={child.avatar} size="xl" />
          <div>
            <PageHeader eyebrow="Child progress" title={child.full_name} />
            <p className="-mt-4 text-sm text-muted-foreground">
              {child.grade || "Grade 1"} · {child.class_name || "1A"} ·{" "}
              {child.preferred_lang === "km" ? "Khmer" : "English"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="card-md">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("parent.child_progress.assigned")}</span>
          <div className="mt-1 text-2xl font-black text-foreground">{stats.total}</div>
        </div>

        <section className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-2xl bg-[#30325F] p-6 text-white">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#A9EEDC]">
              <TrendingUp className="h-4 w-4" /> Weekly report
            </div>
            <h2 className="mt-3 text-2xl font-extrabold">{t("parent.child_progress.week_of_progress")}</h2>
            <p className="mt-2 text-sm leading-7 text-white/70">
              {child.full_name} has completed {completedItems.length} learning activities and is
              currently {completionPercent}% through assigned work.
            </p>
            <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/15">
              <div className="h-full rounded-full bg-[#FFD75E]" style={{ width: `${completionPercent}%` }} />
            </div>
            <div className="mt-2 flex justify-between text-xs font-bold text-white/60">
              <span>{t("student.progress.journey_progress")}</span><span>{completionPercent}%</span>
            </div>
          </div>
          <div className="rounded-2xl border border-[#E7E8F0] bg-white p-6">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#8D90A4]">
              <Target className="h-4 w-4 text-[#514BFF]" /> Parent summary
            </div>
            <div className="mt-5 grid grid-cols-2 gap-4">
              <div><p className="text-2xl font-black text-[#30325F]">{completedItems.length}</p><p className="text-xs text-[#777A91]">{t("parent.child_progress.activities_done")}</p></div>
              <div><p className="text-2xl font-black text-[#30325F]">{stats.avgScore || 0}%</p><p className="text-xs text-[#777A91]">{t("parent.child_progress.average_score")}</p></div>
              <div><p className="text-2xl font-black text-[#D24F75]">{needsAttention.length}</p><p className="text-xs text-[#777A91]">{t("parent.child_progress.need_attention")}</p></div>
              <div><p className="text-2xl font-black text-[#16735D]"><Award className="inline h-5 w-5" /> {completedItems.length >= 3 ? 1 : 0}</p><p className="text-xs text-[#777A91]">{t("parent.child_progress.badges_earned")}</p></div>
            </div>
          </div>
        </section>
        <div className="card-md">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("parent.child_progress.completed")}</span>
          <div className="mt-1 text-2xl font-black text-[#16735D]">{stats.completed}</div>
        </div>
        <div className="card-md">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("parent.child_progress.average_score")}</span>
          <div className="mt-1 text-2xl font-black text-blueberry">{stats.avgScore}%</div>
        </div>
        <div className="card-md">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("parent.child_progress.overdue")}</span>
          <div className="mt-1 text-2xl font-black text-bubblegum">{stats.overdue}</div>
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-lg font-bold text-foreground">{t("parent.child_progress.recent_activity")}</h2>
        <div className="space-y-2">
          {(snapshot.items || []).map((item) => {
            const done = ["completed", "graded"].includes(item.status);
            const Icon = item.item_type === "quiz" ? HelpCircle : BookOpen;
            return (
              <div key={item.id} className="card-sm flex flex-wrap items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted/40 text-muted-foreground">
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-foreground">{text(item.title)}</p>
                  <p className="text-xs capitalize text-muted-foreground">
                    {item.item_type}
                    {item.due_date ? ` · Due ${new Date(item.due_date).toLocaleDateString()}` : ""}
                  </p>
                </div>
                <span
                  className={`rounded-full border px-2.5 py-1 text-[11px] font-bold capitalize ${
                    item.is_overdue && !done
                      ? "border-bubblegum/30 bg-bubblegum/10 text-bubblegum"
                      : statusStyles[item.status] || statusStyles.not_started
                  }`}
                >
                  {item.is_overdue && !done ? "overdue" : (item.status || "not started").replace(/_/g, " ")}
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
              </div>
            );
          })}
          {(snapshot.items || []).length === 0 ? (
            <p className="card text-center text-muted-foreground">{t("parent.child_progress.no_activity")}</p>
          ) : null}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 text-sm text-muted-foreground">
        <p className="flex items-start gap-2">
          <Mail className="mt-0.5 h-4 w-4 shrink-0 text-blueberry" />
          Need a copy of your child's data or want it deleted? Contact the school administrator from the{" "}
          <Link to="/contact" className="font-bold text-blueberry hover:underline">
            contact page
          </Link>
          .
        </p>
        <p className="mt-2 flex items-start gap-2">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#16735D]" />
          No ads, no trackers and no AI training on children's data.
        </p>
      </div>
    </div>
  );
}
