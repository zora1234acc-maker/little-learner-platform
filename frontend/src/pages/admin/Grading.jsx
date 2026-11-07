import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { api } from "../../api/client";
import { Mail, CheckCircle2, Clock } from "lucide-react";

export function AdminGrading() {
  const { t } = useTranslation();
  const [submissions, setSubmissions] = useState([]);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [grading, setGrading] = useState(null); // submission id being graded

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [subRes, gradeRes] = await Promise.all([
      api.grading.submissions.list(),
      api.grading.grades.list()
    ]);
    setSubmissions(subRes.data);
    setGrades(gradeRes.data);
    setLoading(false);
  };

  const gradedIds = new Set(grades.map((g) => g.submission_id));

  const gradeSubmission = async (id, score, comment) => {
    await api.grading.grades.grade(id, { score, comment });
    loadData();
    setGrading(null);
  };

  if (loading) {
    return <div className="text-center py-20 text-muted-foreground animate-pulse">Loading...</div>;
  }

  const pending = submissions.filter((s) => !gradedIds.has(s.id));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-blueberry">Grading Queue</h1>
        <p className="text-muted-foreground">Review and grade student submissions.</p>
      </div>

      <div className="flex gap-2 text-sm mb-4">
        <span className="px-2 py-1 rounded bg-mint/10 text-mint-700">{pending.length} Pending</span>
        <span className="px-2 py-1 rounded bg-muted/50 text-muted-foreground">{grades.length} Graded</span>
      </div>

      {pending.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Clock className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
          <p>No pending submissions.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {pending.map((sub) => (
            <div key={sub.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium text-foreground">Submission #{sub.id.slice(-4)}</p>
                  <p className="text-sm text-muted-foreground">{sub.text || "(file submission)"}</p>
                </div>
                <span className="text-xs font-medium bg-blueberry/10 text-blueberry border border-blueberry/20 px-2 py-1 rounded">Pending</span>
              </div>
              {grading === sub.id ? (
                <div className="space-y-3">
                  <input
                    type="number"
                    placeholder="Score (0-100)"
                    className="w-full px-3 py-2 rounded-lg border border-border text-sm"
                    defaultValue="85"
                  />
                  <textarea
                    placeholder="Comment"
                    className="w-full px-3 py-2 rounded-lg border border-border text-sm"
                    defaultValue="Great work!"
                  />
                  <div className="flex gap-2">
                    <button onClick={() => gradeSubmission(sub.id, 85, "Great work!")} className="flex-1 px-4 py-2 rounded-lg bg-mint text-mint-foreground font-medium hover:bg-mint/90 transition-colors">Grade</button>
                    <button onClick={() => setGrading(null)} className="px-4 py-2 rounded-lg bg-accent hover:bg-accent/90 text-accent-foreground font-medium transition-colors">Cancel</button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setGrading(sub.id)}
                  className="w-full px-4 py-2 rounded-lg bg-blueberry text-white font-medium hover:bg-blueberry/90 transition-colors"
                >
                  Grade Submission
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
