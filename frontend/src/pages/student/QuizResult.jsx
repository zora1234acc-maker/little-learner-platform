import { useTranslation } from "react-i18next";
import { useParams, useNavigate, Link } from "react-router-dom";
import { CheckCircle2, AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { SectionDivider } from "@/components/SectionDivider";

export function QuizResult() {
  const { t } = useTranslation();
  const { quizId } = useParams();
  const navigate = useNavigate();
  const lang = localStorage.getItem("lang") || "en";

  const quizzes = {
    q1: {
      id: "q1",
      title: { en: "Khmer Alphabet Quiz", km: "ប្រអប់អក្សរខ្មែរ", ar: "اختبار الحروف الخميرية" },
      score: 2,
      maxScore: 2,
      percentage: 100,
      answers: [
        { question: "What sound does ក make?", yourAnswer: "k", correctAnswer: "k", correct: true },
        { question: "Which is the first consonant?", yourAnswer: "ក", correctAnswer: "ក", correct: true },
      ]
    },
    q2: {
      id: "q2",
      title: { en: "Counting Quiz", km: "ប្រអប់គណនា", ar: "اختبار العد" },
      score: 0,
      maxScore: 1,
      percentage: 0,
      answers: [
        { question: "What comes after 3?", yourAnswer: "2", correctAnswer: "4", correct: false },
      ]
    }
  };

  const quiz = quizzes[quizId] || quizzes.q1;
  const title = quiz.title[lang] || quiz.title.en;
  const passed = quiz.percentage >= 70;

  return (
    <div className="max-w-md mx-auto space-y-8 py-4">
      <nav className="flex items-center gap-2">
        <Link to="/student/todo" className="flex items-center gap-1 p-2 rounded-[var(--radius-md)] border border-border hover:bg-accent">
          <ArrowLeft className="w-4 h-4" /> {t("common.back")}
        </Link>
      </nav>

      <div className="rounded-[var(--radius-xl)] border border-border bg-card p-8 text-center">
        <div className={`w-32 h-32 rounded-full mx-auto mb-6 flex items-center justify-center ${passed ? "bg-mint/20 text-mint" : "bg-bubblegum/20 text-bubblegum"}`}>
          {passed ? <CheckCircle2 className="w-14 h-14" /> : <AlertCircle className="w-14 h-14" />}
        </div>
        <PageHeader
          eyebrow={t("nav.assign")}
          title={title}
          description={passed ? "Excellent work! You passed this quiz." : "Keep trying! You can retake this quiz."}
        />

        <div className="text-5xl font-black mb-4 {passed ? 'text-mint-600' : 'text-bubblegum-600'}">
          {quiz.score} / {quiz.maxScore}
        </div>
        <div className="text-lg text-muted-foreground mb-8">{quiz.percentage}%</div>

        <div className="space-y-4 mb-8">
          {quiz.answers.map((a, i) => (
            <div key={i} className={`p-4 rounded-[var(--radius-lg)] border ${a.correct ? "border-mint/20 bg-mint/10" : "border-bubblegum/20 bg-bubblegum/10"}`}>
              <div className="flex items-start gap-3 mb-2">
                <span className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${a.correct ? "bg-mint text-white" : "bg-bubblegum text-white"}`}>
                  {a.correct ? "✓" : "✗"}
                </span>
                <div>
                  <div className="text-sm font-medium text-foreground">{a.question}</div>
                  <div className={`text-xs mt-1 ${a.correct ? "text-mint-700" : "text-bubblegum-700"}`}>
                    {a.correct ? "Correct" : `Incorrect — correct answer: ${a.correctAnswer}`}
                  </div>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">Your answer: {a.yourAnswer}</div>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          {!passed && (
            <button
              onClick={() => navigate(`/quiz/${quizId}`)}
              className="flex-1 btn-secondary"
            >
              <RefreshCw className="w-4 h-4 mr-2" /> Try Again
            </button>
          )}
          <Link to="/student/todo" className="flex-1 btn-primary">
            Back to To-do
          </Link>
        </div>
      </div>
    </div>
  );
}
