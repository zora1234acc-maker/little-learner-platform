import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { api } from "@/api/client";
import { useAuth } from "@/context/AuthContext";
import { useSite } from "@/context/SiteContext";
import { ArrowLeft, AlertCircle, CheckCircle2, RefreshCw, ArrowRight } from "lucide-react";

const letterFor = (index) => String.fromCharCode(65 + index);

export function QuizTaker() {
  const { t } = useTranslation();
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { lang } = useSite();

  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const text = (field) => (typeof field === "string" ? field : field?.[lang] || field?.en || "");

  useEffect(() => {
    let live = true;
    setLoading(true);
    setNotFound(false);
    setResult(null);
    setAnswers({});
    setCurrentIndex(0);

    Promise.all([api.content.quizzes.get(quizId), api.content.questions.list(quizId)])
      .then(([quizRes, questionRes]) => {
        if (!live) return;
        setQuiz(quizRes.data);
        setQuestions(questionRes.data || []);
      })
      .catch(() => live && setNotFound(true))
      .finally(() => live && setLoading(false));

    return () => {
      live = false;
    };
  }, [quizId]);

  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const progress = questions.length ? Math.round((answeredCount / questions.length) * 100) : 0;

  const optionLabel = useMemo(() => {
    if (!currentQuestion) return {};
    return Object.fromEntries(
      (currentQuestion.options || []).map((option, index) => [option.id, letterFor(index)])
    );
  }, [currentQuestion]);

  const selectAnswer = (optionId) => {
    if (!currentQuestion) return;
    setAnswers((previous) => ({ ...previous, [currentQuestion.id]: optionId }));
  };

  const submit = async () => {
    setSubmitting(true);
    setError("");
    try {
      const res = await api.grading.quizAttempt(quizId, answers, user?.id || "u3");
      setResult(res.data);
      try {
        sessionStorage.setItem(`ll_attempt_${quizId}`, JSON.stringify(res.data));
      } catch {
        // Ignore storage failures.
      }
    } catch {
      setError(t("common.error"));
    } finally {
      setSubmitting(false);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((index) => index + 1);
      return;
    }
    submit();
  };

  const restart = () => {
    setAnswers({});
    setCurrentIndex(0);
    setResult(null);
    setError("");
  };

  if (loading) {
    return <div className="animate-pulse py-24 text-center text-muted-foreground">{t("common.loading")}</div>;
  }

  if (notFound || !quiz) {
    return (
      <div className="py-24 text-center">
        <p className="text-muted-foreground">Quiz not found.</p>
        <Link to="/subjects" className="btn-secondary mt-4">
          {t("nav.subjects")}
        </Link>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="mx-auto max-w-md py-20 text-center">
        <h1 className="text-2xl font-black text-blueberry">{text(quiz.title)}</h1>
        <p className="mt-2 text-muted-foreground">This quiz has no questions yet.</p>
        <button onClick={() => navigate(-1)} className="btn-secondary mt-6">
          <ArrowLeft className="flip-rtl h-4 w-4" /> {t("common.back")}
        </button>
      </div>
    );
  }

  if (result) {
    const passed = result.percentage >= 70;
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1 rounded-lg border border-border p-2 text-sm font-bold text-muted-foreground hover:bg-accent"
        >
          <ArrowLeft className="flip-rtl h-4 w-4" /> {t("common.back")}
        </button>

        <div className="rounded-[var(--radius-xl)] border border-border bg-white p-6 text-center sm:p-8 shadow-sm">
          <div
            className={`mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-full ${
              passed ? "bg-mint/20 text-[#1B7F66]" : "bg-bubblegum/20 text-bubblegum"
            }`}
          >
            {passed ? <CheckCircle2 className="h-12 w-12" /> : <AlertCircle className="h-12 w-12" />}
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Result</p>
          <h1 className="mt-1 text-2xl font-black text-blueberry">{text(quiz.title)}</h1>
          <div className={`mt-3 text-5xl font-black ${passed ? "text-[#1B7F66]" : "text-bubblegum"}`}>
            {result.score} / {result.max_score}
          </div>
          <p className="mt-1 text-lg text-muted-foreground">{result.percentage}%</p>
          <p className="mt-3 text-sm text-muted-foreground">
            {passed ? "Great job! You passed this quiz." : "Keep trying — you can retake it any time."}
          </p>
        </div>

        <div className="space-y-3">
          {result.answers.map((answer, index) => {
            const question = questions.find((item) => item.id === answer.question_id);
            const pickedOption = question?.options?.find((option) => option.id === answer.picked);
            return (
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
                      {index + 1}. {text(answer.text || question?.text)}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Your answer:{" "}
                      <span className="font-bold text-foreground">
                        {pickedOption ? text(pickedOption.text) : "—"}
                      </span>
                    </p>
                    {!answer.is_correct ? (
                      <p className="mt-1 text-xs text-muted-foreground">
                        Correct answer:{" "}
                        <span className="font-bold text-[#1B7F66]">
                          {text(question?.options?.find((option) => option.is_correct)?.text)}
                        </span>
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <button onClick={restart} className="btn-secondary min-h-[44px] flex-1">
            <RefreshCw className="h-4 w-4" /> Try again
          </button>
          {user?.role === "student" ? (
            <Link to={`/student/quiz-result/${quizId}`} className="btn-primary min-h-[44px] flex-1">
              View full result <ArrowRight className="flip-rtl h-4 w-4" />
            </Link>
          ) : (
            <Link to="/subjects" className="btn-primary min-h-[44px] flex-1">
              {t("nav.subjects")} <ArrowRight className="flip-rtl h-4 w-4" />
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1 rounded-lg border border-border p-2 text-sm font-bold text-muted-foreground hover:bg-accent"
      >
        <ArrowLeft className="flip-rtl h-4 w-4" /> {t("common.back")}
      </button>

      <div className="rounded-[var(--radius-xl)] border border-border bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-blueberry/80">Quiz</p>
            <h1 className="mt-1 text-2xl font-black text-blueberry">{text(quiz.title)}</h1>
            {quiz.description ? (
              <p className="mt-1 text-sm text-muted-foreground">{text(quiz.description)}</p>
            ) : null}
          </div>
          <span className="rounded-full bg-blueberry/10 px-3 py-1 text-xs font-bold text-blueberry">
            {currentIndex + 1} / {questions.length}
          </span>
        </div>

        <div className="mt-5 h-2 overflow-hidden rounded-full bg-muted/40">
          <div className="h-full rounded-full bg-blueberry transition-all" style={{ width: `${progress}%` }} />
        </div>

        <div className="mt-6 rounded-xl bg-paper p-5">
          <p className="text-lg font-medium leading-relaxed text-foreground/90">
            {text(currentQuestion.text)}
          </p>
          {currentQuestion.image_url ? (
            <img
              src={currentQuestion.image_url}
              alt=""
              className="mt-3 max-h-56 rounded-lg border border-border object-contain"
            />
          ) : null}
        </div>

        {error ? (
          <p className="mt-4 rounded-xl border border-bubblegum/40 bg-bubblegum/10 px-4 py-3 text-sm text-bubblegum">
            {error}
          </p>
        ) : null}

        <div className="mt-5 space-y-3">
          {(currentQuestion.options || []).map((option) => {
            const selected = answers[currentQuestion.id] === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => selectAnswer(option.id)}
                className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition ${
                  selected
                    ? "border-blueberry bg-blueberry text-white"
                    : "border-border bg-white text-foreground hover:bg-accent/50"
                }`}
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-black ${
                    selected ? "bg-white/20 text-white" : "bg-muted/40 text-muted-foreground"
                  }`}
                >
                  {optionLabel[option.id]}
                </span>
                <span className="font-medium">{text(option.text)}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setCurrentIndex((index) => Math.max(0, index - 1))}
            disabled={currentIndex === 0}
            className={`btn-ghost ${currentIndex === 0 ? "opacity-40" : ""}`}
          >
            {t("common.back")}
          </button>

          <button
            type="button"
            onClick={nextQuestion}
            disabled={!answers[currentQuestion.id] || submitting}
            className={`btn-primary min-h-[44px] px-6 ${
              !answers[currentQuestion.id] || submitting ? "cursor-not-allowed opacity-50" : ""
            }`}
          >
            {submitting
              ? "Checking..."
              : currentIndex === questions.length - 1
              ? t("common.submit")
              : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
