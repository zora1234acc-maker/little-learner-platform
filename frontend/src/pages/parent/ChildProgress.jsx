import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, CheckCircle2, Clock, Mail } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

export function ParentChildProgress() {
  const { t } = useTranslation();
  const { childId } = useParams();

  const activities = [
    { item: "Khmer Alphabet", type: "Lesson", status: "completed", score: 92, date: "Nov 15" },
    { item: "Counting Quiz", type: "Quiz", status: "graded", score: 78, date: "Nov 14" },
    { item: "Draw a Plant", type: "Assignment", status: "submitted", score: null, date: "Nov 13" },
    { item: "Parts of a Plant", type: "Lesson", status: "overdue", score: null, date: "Nov 10" }
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <nav className="flex items-center gap-2 mb-6">
        <Link to="/parent" className="flex items-center gap-1 p-2 rounded-lg border border-border hover:bg-accent">
          <ArrowLeft className="w-4 h-4" /> {t("common.back")}
        </Link>
      </nav>

      <PageHeader eyebrow={t("nav.classProgress")} title="Child Progress" />

      <div className="card">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-muted/40 flex items-center justify-center">
            <span className="text-3xl">👦</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-blueberry">Sophal</h1>
            <p className="text-muted-foreground">Grade 1 • Khmer</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="card">
            <div className="text-xs font-semibold tracking-wider text-muted-foreground uppercase mb-1">Completed</div>
            <div className="text-2xl font-bold text-mint-600">2</div>
          </div>
          <div className="card">
            <div className="text-xs font-semibold tracking-wider text-muted-foreground uppercase mb-1">Average Score</div>
            <div className="text-2xl font-bold text-blueberry">85%</div>
          </div>
          <div className="card">
            <div className="text-xs font-semibold tracking-wider text-muted-foreground uppercase mb-1">Overdue</div>
            <div className="text-2xl font-bold text-bubblegum-600">1</div>
          </div>
        </div>

        <h3 className="font-semibold text-lg text-foreground mb-3">Recent Activity</h3>
        <div className="space-y-3">
          {activities.map((a) => {
            const statusConfig = {
              completed: { color: "text-mint-700 bg-mint/10 border border-mint/20", icon: <CheckCircle2 className="w-3 h-3" />, label: "Completed" },
              graded: { color: "text-blueberry-700 bg-blueberry/10 border border-blueberry/20", icon: <CheckCircle2 className="w-3 h-3" />, label: "Graded" },
              submitted: { color: "text-sky-700 bg-sky/10 border border-sky/20", icon: <Mail className="w-3 h-3" />, label: "Submitted" },
              overdue: { color: "text-bubblegum-700 bg-bubblegum/10 border border-bubblegum/20", icon: <Clock className="w-3 h-3" />, label: "Overdue" }
            };
            const cfg = statusConfig[a.status];
            return (
              <div key={a.item} className="flex items-center justify-between p-3 rounded-lg border border-border bg-background">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-muted/40 flex items-center justify-center text-xs">{a.type === "Lesson" ? "📖" : a.type === "Quiz" ? "📝" : "📎"}</div>
                  <div>
                    <div className="font-medium text-foreground">{a.item}</div>
                    <div className="text-xs text-muted-foreground">{a.type} • {a.date}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium border ${cfg.color}`}>{cfg.icon} {cfg.label}</span>
                  {a.score !== null && <span className="font-medium text-foreground">{a.score}%</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
