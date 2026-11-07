import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { api } from "../../api/client";
import { Mail, Clock } from "lucide-react";

export function AdminGrading() {
  const { t } = useTranslation();
  const [submissions, setSubmissions] = useState([]);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [grading, setGrading] = useState(null);

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

  if (loading) {
    return <div className="text-center py-20 text-muted-foreground animate-pulse">Loading...</div>;
  }

  const pending = submissions.filter((s) => !gradedIds.has(s.id));

  return (
    <div className="space-y-6">
      <div>
        <span className="eyebrow">Grading Queue</span>
        <h1 className="text-2xl font-bold text-blueberry">Grade submissions</h1>
        <p className="text-muted-foreground">Review and grade student work.</p>
      </div>

      <div className="flex gap-3 text-sm mb-4">
        <span className="px-2.5 py-1 rounded-md bg-mint/10 text-mint-700 border border-mint/20">{pending.length} Pending</span>
        <span className="px-2.5 py-1 rounded-md bg-muted/40 text-muted-foreground border border-muted/40">{grades.length} Graded</span>
      </div>

      {pending.length === 0 ? (
        <div className="py-20 text-center text-muted-foreground">
          <Clock className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
          <p>No pending submissions.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {pending.map((sub) => (
            <div key={sub.id} className="card p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-medium text-foreground">Submission #{sub.id.slice(-4)}</p>
                  <p className="text-sm text-muted-foreground">{sub.text || "(file submission)"}</p>
                </div>
                <span className="text-xs font-medium bg-blueberry/10 text-blueberry border border-blueberry/20 px-2 py-1 rounded">Pending</span>
              </div>
              {grading === sub.id ? (
                <div className="space-y-3">
                  <label className="field-label">Score (0-100)</label>
                  <input type="number" defaultValue="85" className="input-field" />
                  <label className="field-label">Comment</label>
                  <textarea defaultValue="Great work!" className="input-field h-24" />
                  <div className="flex gap-2">
                    <button onClick={() => { setGrading(null); loadData(); }} className="flex-1 btn-primary">Grade</button>
                    <button onClick={() => setGrading(null)} className="btn-ghost">Cancel</button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setGrading(sub.id)}
                  className="w-full btn-secondary"
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
