import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Clock, Users } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Avatar } from "@/components/Avatar";
import { api } from "@/api/client";
import { useAuth } from "@/context/AuthContext";

export function ParentChildren() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let live = true;
    api.progress
      .children(user.id)
      .then((result) => live && setChildren(result.data))
      .finally(() => live && setLoading(false));
    return () => {
      live = false;
    };
  }, [user.id]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Parent"
        title="My children"
        description="View progress for your linked children. You only see children linked to your account."
      />

      {loading ? (
        <div className="animate-pulse py-20 text-center text-muted-foreground">{t("common.loading")}</div>
      ) : null}

      <div className="space-y-4">
        {children.map((child) => {
          const stats = child.progress || {};
          const percent = stats.total ? Math.round((stats.completed / stats.total) * 100) : 0;
          return (
            <article
              key={child.id}
              className="rounded-2xl border border-border bg-card p-5 transition hover:border-blueberry/30"
            >
              <div className="flex flex-wrap items-center gap-4">
                <Avatar src={child.avatar_url} name={child.avatar} size="lg" />

                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-foreground">{child.full_name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {child.grade || "Grade 1"} · {child.class_name || "1A"} ·{" "}
                    {child.preferred_lang === "km" ? "Khmer" : "English"}
                  </p>

                  <div className="mt-2 flex flex-wrap gap-3 text-xs font-bold text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#16735D]" /> {stats.completed || 0} done
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-bubblegum" /> {stats.overdue || 0} overdue
                    </span>
                    <span>{stats.avgScore ? `${stats.avgScore}% average` : t("common.no_scores_yet")}</span>
                  </div>
                </div>

                <div className="w-full sm:w-40">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      {stats.completed || 0}/{stats.total || 0}
                    </span>
                    <span>{percent}%</span>
                  </div>
                  <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-muted/40">
                    <div className="h-full rounded-full bg-blueberry" style={{ width: `${percent}%` }} />
                  </div>
                </div>

                <Link to={`/parent/child/${child.id}`} className="btn-secondary min-h-[42px] px-4 py-2 text-sm">
                  View details <ArrowRight className="flip-rtl h-3.5 w-3.5" />
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      {!loading && children.length === 0 ? (
        <div className="card py-16 text-center text-muted-foreground">
          <Users className="mx-auto mb-3 h-8 w-8" />
          <p>{t("parent.children.no_children_linked")}</p>
          <p className="mt-1 text-sm">{t("parent.children.ask_admin_link")}</p>
        </div>
      ) : null}
    </div>
  );
}
