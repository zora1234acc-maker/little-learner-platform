import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { CheckCircle2, Clock, Mail } from "lucide-react";
import { api } from "@/api/client";
import { PageHeader } from "@/components/PageHeader";
import { Avatar } from "@/components/Avatar";
import { useSite } from "@/context/SiteContext";

export function AdminGrading() {
  const { t } = useTranslation();
  const { lang } = useSite();
  const [submissions, setSubmissions] = useState([]);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("pending");
  const [grading, setGrading] = useState(null);
  const [score, setScore] = useState("85");
  const [comment, setComment] = useState("Good work!");
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    const [subRes, gradeRes] = await Promise.all([api.grading.submissions.list(), api.grading.grades.list()]);
    setSubmissions(subRes.data);
    setGrades(gradeRes.data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const gradedIds = useMemo(() => new Set(grades.map((grade) => grade.submission_id)), [grades]);
  const pending = submissions.filter((submission) => !gradedIds.has(submission.id));

  const startGrading = (submission) => {
    setGrading(submission.id);
    setScore("85");
    setComment("");
  };

  const saveGrade = async (submission) => {
    const numeric = Math.max(0, Math.min(100, Number(score) || 0));
    setSaving(true);
    await api.grading.grades.grade(submission.id, {
      score: numeric,
      comment: { en: comment || "Well done!", km: comment || "ល្អណាស់!", ar: comment || "أحسنت!" },
    });
    setGrading(null);
    setSaving(false);
    await loadData();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader eyebrow={t("nav.grading")} title="Grade submissions" description="Review and grade student work." />
        <div className="animate-pulse py-20 text-center text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const visible = tab === "pending" ? pending : grades;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={t("nav.grading")}
        title="Grade submissions"
        description="Read the student's work, give a score out of 100 and leave a short comment."
      />

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setTab("pending")}
          className={`min-h-[42px] rounded-xl px-4 text-sm font-bold ${
            tab === "pending" ? "bg-blueberry text-white" : "border border-border bg-card text-muted-foreground hover:bg-accent"
          }`}
        >
          <Clock className="me-1.5 inline h-4 w-4" /> Pending ({pending.length})
        </button>
        <button
          onClick={() => setTab("graded")}
          className={`min-h-[42px] rounded-xl px-4 text-sm font-bold ${
            tab === "graded" ? "bg-blueberry text-white" : "border border-border bg-card text-muted-foreground hover:bg-accent"
          }`}
        >
          <CheckCircle2 className="me-1.5 inline h-4 w-4" /> Graded ({grades.length})
        </button>
      </div>

      {visible.length === 0 ? (
        <div className="card py-16 text-center text-muted-foreground">
          <Mail className="mx-auto mb-3 h-8 w-8" />
          <p>{tab === "pending" ? "No pending submissions." : "No graded work yet."}</p>
        </div>
      ) : tab === "pending" ? (
        <div className="space-y-4">
          {pending.map((submission) => (
            <article key={submission.id} className="card-md">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Avatar src={submission.student_avatar_url} name={submission.student_name} size="md" />
                  <div>
                    <p className="font-bold text-foreground">{submission.student_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {submission.assignment_title?.[lang] || submission.assignment_title?.en || "Assignment"} ·{" "}
                      {new Date(submission.submitted_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-sunshine/20 px-3 py-1 text-xs font-bold text-[#8A6200]">Pending</span>
              </div>

              <div className="mt-4 rounded-xl border border-border bg-background p-4">
                <p className="text-sm font-bold text-muted-foreground">Student's answer</p>
                <p className="mt-1 whitespace-pre-wrap text-sm text-foreground">{submission.text || "(file submission)"}</p>
                {submission.file_name ? (
                  <p className="mt-2 text-xs font-bold text-blueberry">📎 {submission.file_name}</p>
                ) : null}
              </div>

              {grading === submission.id ? (
                <div className="mt-4 space-y-3">
                  <div className="grid gap-3 sm:grid-cols-[140px_1fr]">
                    <div>
                      <label className="field-label">Score (0-100)</label>
                      <input type="number" min="0" max="100" value={score} onChange={(event) => setScore(event.target.value)} className="input-field" />
                    </div>
                    <div>
                      <label className="field-label">Comment</label>
                      <input value={comment} onChange={(event) => setComment(event.target.value)} className="input-field" placeholder="What did the student do well?" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => saveGrade(submission)} disabled={saving} className="btn-primary min-h-[44px] flex-1">
                      {saving ? "Saving..." : "Save grade"}
                    </button>
                    <button onClick={() => setGrading(null)} className="btn-ghost flex-1">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button onClick={() => startGrading(submission)} className="btn-secondary mt-4 w-full min-h-[44px]">
                  Grade submission
                </button>
              )}
            </article>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {grades.map((grade) => (
            <article key={grade.id} className="card-sm flex flex-wrap items-center gap-3">
              <Avatar name={grade.student_name} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-foreground">
                  {grade.student_name} · {grade.assignment_title?.[lang] || grade.assignment_title?.en || "Assignment"}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {typeof grade.comment === "string" ? grade.comment : grade.comment?.[lang] || grade.comment?.en}
                </p>
              </div>
              <span className={`rounded-full px-3 py-1 text-sm font-black ${grade.score >= 70 ? "bg-mint/15 text-[#16735D]" : "bg-bubblegum/15 text-bubblegum"}`}>
                {grade.score}/100
              </span>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
