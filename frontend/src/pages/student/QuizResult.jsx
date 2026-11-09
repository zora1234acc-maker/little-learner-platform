import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams, Link } from "react-router-dom";
import { AlertCircle, ArrowLeft, CheckCircle2, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { api } from "@/api/client";
import { useAuth } from "@/context/AuthContext";
import { useSite } from "@/context/SiteContext";

export function QuizResult() {
  const { t } = useTranslation();
  const { lang } = useSite();
  const { quizId } = useParams();
  const { user } = useAuth();

  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let live = true;

    const stored = (() => {
      try {
        const raw = sessionStorage.getItem(`ll_attempt_${quizId}`);
        return raw ? JSON.parse(raw) : null;
      } catch {
        return null;
      }
    })();

    Promise.all([
      api.content.quizzes.get(quizId).catch(() => null),
      api.content.questions.list(quizId).catch(() => ({ data: [] })),
      api.grading.attempts.list({ studentId: user?.id, quizId }).catch(() => ({ data: [] })),
    ])
      .then(([quizRes, questionRes, attemptRes]) => {
        if (!live) return;
        setQuiz(quizRes?.data || null);
        setQuestions(questionRes?.data || []);
        setAttempt(attemptRes?.data?.[0] || stored || null);
      })
      .finally(() => live && setLoading(false));

    return () => {
      live = false;
    };
  }, [quizId, user?.id]);

  const text = (field) => (typeof field === "string" ? field : field?.[lang] || field?.en || "");

  if (loading) {
    return <div className="animate-pulse py-24 text-center text-muted-foreground">{t("common.loading")}</div>;
  }

  if (!attempt) {
    return (
      <div className="mx-auto max-w-md py-20 text-center">
        <AlertCircle className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
        <p className="text-muted-foreground">{t("student.quiz_result.not_taken")}</p>
        <Link to={`/quiz/${quizId}`} className="btn-primary mt-4">
          Take the quiz
        </Link>
      </div>
    );
  }

  const passed = attempt.percentage >= 70;

  const optionText = (questionId, optionId) => {
    const question = questions.find((item) => item.id === questionId);
    const option = question?.options?.find((item) => item.id === optionId);
    return option ? text(option.text) : "—";
  };

  const correctOptionText = (questionId) => {
    const question = questions.find((item) => item.id === questionId);
    const option = question?.options?.find((item) => item.is_correct);
    return option ? text(option.text) : "—";
  };

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

      <div className="rounded-[var(--radius-xl)] border border-border bg-card p-6 text-center sm:p-8">
        <div
          className={`mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-full ${
            passed ? "bg-mint/20 text-[#1B7F66]" : "bg-bubblegum/20 text-bubblegum"
          }`}
        >
          {passed ? <CheckCircle2 className="h-12 w-12" /> : <AlertCircle className="h-12 w-12" />}
        </div>

        <PageHeader
          eyebrow={t("nav.assign")}
          title={quiz ? text(quiz.title) : "Quiz result"}
          description={passed ? "Excellent work! You passed this quiz." : "Keep trying — you can retake this quiz."}
        />

        <div className={`text-5xl font-black ${passed ? "text-[#1B7F66]" : "text-bubblegum"}`}>
          {attempt.score} / {attempt.max_score}
        </div>
        <div className="mt-1 text-lg text-muted-foreground">{attempt.percentage}%</div>
        {attempt.created_at ? (
          <p className="mt-2 text-xs text-muted-foreground">
            Taken {new Date(attempt.created_at).toLocaleString()}
          </p>
        ) : null}
      </div>

      <div className="space-y-3">
        {(attempt.answers || []).map((answer, index) => (
          <div
            key={answer.question_id || index}
            className={`rounded-xl border p-4 ${
              answer.is_correct
                ? "border-mint/30 bg-mint/10"
                : "border-bubblegum/30 bg-bubblegum/10"
            }`}
          >
            <div className="flex items-start gap-3">
              <span
                className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${
                  answer.is_correct ? "bg-[#2FBF94]" : "bg-bubblegum"
                }`}
              >
                {answer.is_correct ? "✓" : "✗"}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-bold text-foreground">
                  {index + 1}. {text(answer.text)}
                </p>
                <p className={`mt-1 text-xs ${answer.is_correct ? "text-[#16735D]" : "text-bubblegum"}`}>
                  {answer.is_correct ? "Correct" : "Incorrect"}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Your answer:{" "}
                  <span className="font-bold text-foreground">
                    {optionText(answer.question_id, answer.picked)}
                  </span>
                </p>
                {!answer.is_correct ? (
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Correct answer:{" "}
                    <span className="font-bold text-[#16735D]">
                      {correctOptionText(answer.question_id)}
                    </span>
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Link to={`/quiz/${quizId}`} className="btn-secondary min-h-[44px] flex-1">
          <RefreshCw className="h-4 w-4" /> Try again
        </Link>
        <Link to="/student/todo" className="btn-primary min-h-[44px] flex-1">
          Back to to-do
        </Link>
      </div>
    </div>
  );
}
