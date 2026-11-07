import { useTranslation } from "react-i18next";
import { CheckCircle2, Clock } from "lucide-react";

export function TeacherClassProgress() {
  const { t } = useTranslation();

  const students = [
    { id: "u3", name: "Sophal", avatar: "🐻", completed: 3, total: 5, avgScore: 85, status: "active" },
    { id: "u4", name: "Sophea", avatar: "🐱", completed: 1, total: 5, avgScore: 60, status: "overdue" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <span className="eyebrow">Class Progress</span>
        <h1 className="text-2xl font-bold text-blueberry">Track your students</h1>
        <p className="text-muted-foreground">See completion and scores per student.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <div className="text-xs font-semibold tracking-wider text-muted-foreground uppercase mb-1">Total Students</div>
          <div className="text-2xl font-bold text-foreground">{students.length}</div>
        </div>
        <div className="card">
          <div className="text-xs font-semibold tracking-wider text-muted-foreground uppercase mb-1">Completed Assignments</div>
          <div className="text-2xl font-bold text-mint-600">{students.reduce((a, b) => a + b.completed, 0)}</div>
        </div>
        <div className="card">
          <div className="text-xs font-semibold tracking-wider text-muted-foreground uppercase mb-1">Average Score</div>
          <div className="text-2xl font-bold text-blueberry">72%</div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/40">
            <tr>
              <th className="px-4 py-3 font-medium text-muted-foreground">Student</th>
              <th className="px-4 py-3 font-medium text-muted-foreground text-center">Completed</th>
              <th className="px-4 py-3 font-medium text-muted-foreground text-center">Avg Score</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.id} className="border-b border-border hover:bg-accent/40 transition-colors">
                <td className="px-4 py-3 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-muted/40 flex items-center justify-center text-xs">{s.avatar}</span>
                  <span className="font-medium text-foreground">{s.name}</span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="text-muted-foreground">{s.completed}</span> <span className="text-xs text-muted-foreground">/ {s.total}</span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`font-medium ${s.avgScore >= 70 ? "text-mint-700" : "text-bubblegum-700"}`}>{s.avgScore}%</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium ${s.status === "active" ? "bg-mint/10 text-mint-700 border border-mint/20" : "bg-bubblegum/10 text-bubblegum-700 border border-bubblegum/20"}`}>
                    {s.status === "active" ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />} {s.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
