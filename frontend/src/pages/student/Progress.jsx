import { useTranslation } from "react-i18next";
import { BarChart3, CheckCircle2, Clock } from "lucide-react";

export function StudentProgress() {
  const { t } = useTranslation();

  const progress = [
    { subject: "Khmer Language", completed: 2, total: 3, score: 92 },
    { subject: "Mathematics", completed: 1, total: 3, score: 78 },
    { subject: "Science", completed: 0, total: 3, score: 0 }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-blueberry">My Progress</h1>
        <p className="text-muted-foreground">See your completion and scores.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Lessons Done</div>
          <div className="text-3xl font-bold text-blueberry">3</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Quizzes Taken</div>
          <div className="text-3xl font-bold text-sunshine">2</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Average Score</div>
          <div className="text-3xl font-bold text-mint-600">85%</div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 font-medium text-muted-foreground">Subject</th>
              <th className="px-4 py-3 font-medium text-muted-foreground text-center">Progress</th>
              <th className="px-4 py-3 font-medium text-muted-foreground text-center">Score</th>
            </tr>
          </thead>
          <tbody>
            {progress.map((p) => {
              const pct = Math.round((p.completed / p.total) * 100);
              return (
                <tr key={p.subject} className="border-b border-border hover:bg-accent/50 transition-colors">
                  <td className="px-4 py-3">{p.subject}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="w-full bg-muted/50 rounded-full h-2">
                      <div className={`bg-blueberry h-2 rounded-full`} style={{ width: `${pct}%` }} />
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">{p.completed} / {p.total}</div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`font-medium ${p.score >= 70 ? "text-mint-700" : "text-muted-foreground"}`}>{p.score}%</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
