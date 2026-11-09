import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2, Clock, HelpCircle, Paperclip, Play } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { api } from "@/api/client";
import { useAuth } from "@/context/AuthContext";
import { useSite } from "@/context/SiteContext";

export function AssignmentSubmit() {
  const { t } = useTranslation();
  const { lang } = useSite();
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileRef = useRef(null);

  const [target, setTarget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submissionType, setSubmissionType] = useState("text");
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let live = true;
    api.assignments.targets
      .list({ studentId: user.id })
      .then((result) => {
        if (!live) return;
        const found = result.data.find((item) => item.id === assignmentId);
        setTarget(found || null);
      })
      .catch(() => live && setTarget(null))
      .finally(() => live && setLoading(false));
    return () => {
      live = false;
    };
  }, [assignmentId, user.id]);

  const textOf = (field) => (typeof field === "string" ? field : field?.[lang] || field?.en || "");

  const submit = async (event) => {
    event.preventDefault();
    if (!target) return;
    setSaving(true);
    setError("");
    try {
      await api.grading.submissions.create({
        target_id: target.id,
        student_id: user.id,
        text: submissionType === "text" ? text : "",
        file_name: submissionType === "file" ? file?.name : null,
        file_url: submissionType === "file" && file ? URL.createObjectURL(file) : null,
      });
      setSubmitted(true);
    } catch {
      setError("Could not submit your work. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="animate-pulse py-24 text-center text-muted-foreground">{t("common.loading")}</div>;
  }

  if (!target) {
    return (
      <div className="mx-auto max-w-md py-20 text-center">
        <p className="text-muted-foreground">{t("student.submit.not_found")}</p>
        <Link to="/student/todo" className="btn-secondary mt-4">
          <ArrowLeft className="flip-rtl h-4 w-4" /> {t("common.back")}
        </Link>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-md space-y-6 py-16">
        <div className="rounded-[var(--radius-xl)] border border-border bg-card p-8 text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-mint/20 text-[#1B7F66]">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h1 className="text-2xl font-black text-blueberry">{t("student.submit.work_submitted")}</h1>
          <p className="mt-2 text-muted-foreground">
            Your teacher will review it soon. You can follow the grade in your progress page.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link to="/student/todo" className="btn-secondary min-h-[44px] flex-1">
            Back to to-do
          </Link>
          <Link to="/student/progress" className="btn-primary min-h-[44px] flex-1">
            View progress <ArrowRight className="flip-rtl h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  const alreadyDone = ["submitted", "graded", "completed"].includes(target.status);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <nav className="flex items-center gap-2">
        <Link
          to="/student/todo"
          className="inline-flex items-center gap-1 rounded-lg border border-border p-2 text-sm font-bold text-muted-foreground hover:bg-accent"
        >
          <ArrowLeft className="flip-rtl h-4 w-4" /> {t("common.back")}
        </Link>
      </nav>

      <PageHeader
        eyebrow={t("nav.assign")}
        title={textOf(target.title)}
        description={textOf(target.instructions) || "Complete the activity and submit your work."}
      />

      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="rounded-full bg-blueberry/10 px-3 py-1 font-bold capitalize text-blueberry">
          {target.item_type}
        </span>
        {target.due_date ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-muted/40 px-3 py-1 font-bold text-muted-foreground">
            <Clock className="h-3.5 w-3.5" /> Due {new Date(target.due_date).toLocaleDateString()}
          </span>
        ) : null}
        {target.is_overdue ? (
          <span className="rounded-full bg-bubblegum/10 px-3 py-1 font-bold text-bubblegum">{t("common.overdue")}</span>
        ) : null}
        {alreadyDone ? (
          <span className="rounded-full bg-mint/10 px-3 py-1 font-bold capitalize text-[#16735D]">
            {target.status.replace(/_/g, " ")}
          </span>
        ) : null}
      </div>

      {target.item_type === "quiz" ? (
        <div className="card-md text-center">
          <HelpCircle className="mx-auto mb-3 h-8 w-8 text-[#8A6200]" />
          <p className="font-bold text-foreground">{t("student.submit.quiz_task")}</p>
          <p className="mt-1 text-sm text-muted-foreground">{t("student.submit.open_quiz")}</p>
          <Link to={`/quiz/${target.item_id}`} className="btn-primary mt-4">
            Open quiz <ArrowRight className="flip-rtl h-4 w-4" />
          </Link>
        </div>
      ) : (
        <>
          {target.item_type === "lesson" ? (
            <Link to={`/lesson/${target.item_id}`} className="btn-secondary w-full min-h-[44px]">
              <Play className="h-4 w-4" /> Open the lesson first
            </Link>
          ) : null}

          <form onSubmit={submit} className="card-md space-y-5">
            {error ? (
              <p className="rounded-xl border border-bubblegum/40 bg-bubblegum/10 px-4 py-3 text-sm text-bubblegum">
                {error}
              </p>
            ) : null}

            <div>
              <span className="field-label">{t("student.submit.how_submit")}</span>
              <div className="mt-1 flex gap-2">
                {[
                  { id: "text", label: "Write an answer" },
                  { id: "file", label: "Upload a file" },
                ].map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setSubmissionType(option.id)}
                    className={`min-h-[44px] flex-1 rounded-xl border text-sm font-bold ${
                      submissionType === option.id
                        ? "border-blueberry bg-blueberry text-white"
                        : "border-border bg-background text-muted-foreground hover:bg-accent"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {submissionType === "text" ? (
              <div>
                <label className="field-label">{t("student.submit.your_answer")}</label>
                <textarea
                  value={text}
                  onChange={(event) => setText(event.target.value)}
                  rows={6}
                  className="input-field"
                  placeholder="Type your answer here..."
                />
                <p className="mt-1 text-xs text-muted-foreground">{t("student.submit.write_own_words")}</p>
              </div>
            ) : (
              <div>
                <span className="field-label">{t("student.submit.upload_file")}</span>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex w-full flex-col items-center gap-2 rounded-xl border-2 border-dashed border-border bg-background px-6 py-8 text-center transition hover:border-blueberry/40 hover:bg-blueberry/5"
                >
                  <Paperclip className="h-6 w-6 text-muted-foreground" />
                  <span className="text-sm font-bold text-foreground">
                    {file ? file.name : "Click to choose a file"}
                  </span>
                  <span className="text-xs text-muted-foreground">{t("student.submit.file_types")}</span>
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  className="hidden"
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={(event) => setFile(event.target.files?.[0] || null)}
                />
                {file ? (
                  <button
                    type="button"
                    onClick={() => {
                      setFile(null);
                      if (fileRef.current) fileRef.current.value = "";
                    }}
                    className="mt-2 text-xs font-bold text-bubblegum hover:underline"
                  >
                    Remove file
                  </button>
                ) : null}
              </div>
            )}

            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="submit"
                disabled={saving || (submissionType === "text" ? !text.trim() : !file)}
                className={`btn-primary min-h-[46px] flex-1 ${
                  saving || (submissionType === "text" ? !text.trim() : !file)
                    ? "cursor-not-allowed opacity-50"
                    : ""
                }`}
              >
                {saving ? "Submitting..." : t("common.submit")}
              </button>
              <button type="button" onClick={() => navigate(-1)} className="btn-ghost min-h-[46px] flex-1">
                {t("common.cancel")}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
