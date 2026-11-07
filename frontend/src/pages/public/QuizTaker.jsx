import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { api } from "../../api/client";
import { ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";

export function QuizTaker() {
  const { t } = useTranslation();
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [lang] = useState(() => localStorage.getItem("lang") || "en");

  useEffect(() => {
    const allQuizzes = {
      q1: { id: "q1", title: { en: "Khmer Alphabet Quiz", km: "ប្រអប់អក្សរខ្មែរ", ar: "اختبار الحروف الخميرية" } },
      q2: { id: "q2", title: { en: "Counting Quiz", km: "ប្រអប់គណនា", ar: "اختبار العد" } }
    };
    const allQuestions = {
      q1: [
        { id: "qa1", text: { en: "What sound does ក make?", km: "អក្សរ ក អានថាអ្វី?", ar: "ما الصوت الذي يصدره حرف كه؟" }, options: [
          { id: "oa1", text: { en: "k", km: "ក", ar: "ك" }, is_correct: true },
          { id: "oa2", text: { en: "s", km: "ស", ar: "س" }, is_correct: false },
          { id: "oa3", text: { en: "m", km: "ម", ar: "م" }, is_correct: false },
          { id: "oa4", text: { en: "t", km: "ត", ar: "ت" }, is_correct: false }
        ] },
        { id: "qa2", text: { en: "Which is the first consonant?", km: "ណាជាអក្សរដើម?", ar: "أيهما الحرف الأول؟" }, options: [
          { id: "oa5", text: { en: "ក", km: "ក", ar: "كه" }, is_correct: true },
          { id: "oa6", text: { en: "ខ", km: "ខ", ar: "خا" }, is_correct: false },
          { id: "oa7", text: { en: "គ", km: "គ", ar: "كاف" }, is_correct: false },
          { id: "oa8", text: { en: "ឃ", km: "ឃ", ar: "خاخ" }, is_correct: false }
        ] }
      ],
      q2: [
        { id: "qa3", text: { en: "What comes after 3?", km: "ណានេះមកក្រោយលេខ 3?", ar: "ما الذي يأتي بعد 3؟" }, options: [
          { id: "oa9", text: { en: "4", km: "៤", ar: "٤" }, is_correct: true },
          { id: "oa10", text: { en: "2", km: "២", ar: "٢" }, is_correct: false },
          { id: "oa11", text: { en: "5", km: "៥", ar: "٥" }, is_correct: false },
          { id: "oa12", text: { en: "6", km: "៦", ar: "٦" }, is_correct: false }
        ] }
      ]
    };
    setQuiz(allQuizzes[quizId]);
    setQuestions(allQuestions[quizId] || []);
  }, [quizId]);

  const currentQuestion = questions[currentIndex];

  const selectAnswer = (optionId) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionId }));
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      submitQuiz();
    }
  };

  const submitQuiz = async () => {
    const res = await api.grading.quizAttempt(quizId, answers);
    setResult(res.data);
    setSubmitted(true);
  };

  const langLabel = { en: "English", km: "ភាសាខ្មែរ", ar: "العربية" }[lang] || "English";

  if (!quiz) {
    return <div className="text-center py-20 text-muted-foreground animate-pulse">{t("common.loading")}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <nav className="flex items-center gap-2">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 p-2 rounded-md border border-border hover:bg-accent">
          <ArrowLeft className="w-4 h-4" /> {t("common.back")}
        </button>
      </nav>

      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-blueberry">{quiz.title[lang] || quiz.title.en}</h2>
          <span className="text-xs font-medium bg-blueberry/10 text-blueberry px-2 py-1 rounded">{currentIndex + 1} / {questions.length}</span>
        </div>

        {!submitted ? (
          <>
            <div className="bg-blueberry/5 rounded-xl p-4 mb-6">
              <p className="text-foreground text-lg font-medium">{currentQuestion.text[lang] || currentQuestion.text.en}</p>
            </div>
            <div className="space-y-3">
              {currentQuestion.options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => selectAnswer(opt.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg border transition-colors text-left ${answers[currentQuestion.id] === opt.id ? "bg-blueberry border-blueberry text-white" : "border-border bg-white text-foreground hover:bg-accent/50"}`}
                >
                  {opt.text[lang] || opt.text.en}
                </button>
              ))}
            </div>
            <div className="mt-6 flex justify-between">
              {currentIndex > 0 && (
                <button onClick={() => setCurrentIndex(currentIndex - 1)} className="px-4 py-2 rounded-lg border border-border hover:bg-accent text-sm">
                  {t("common.back")}
                </button>
              )}
              <button
                onClick={nextQuestion}
                disabled={!answers[currentQuestion.id]}
                className={`px-6 py-2 rounded-lg font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${currentIndex === questions.length - 1 ? "bg-sunshine text-blueberry hover:bg-yellow-300" : "bg-blueberry text-white hover:bg-blueberry/90"} ${!answers[currentQuestion.id] && "opacity-50 cursor-not-allowed"}`}
              >
                {currentIndex === questions.length - 1 ? t("common.submit") : "Next"}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="text-center py-8">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${result.percentage >= 70 ? "bg-mint/20 text-mint" : "bg-bubblegum/20 text-bubblegum"}`}>
                {result.percentage >= 70 ? <CheckCircle2 className="w-10 h-10" /> : <AlertCircle className="w-10 h-10" />}
              </div>
              <h3 className="text-xl font-bold text-foreground">{result.percentage >= 70 ? "Great job!" : "Keep trying!"}</h3>
              <p className="text-muted-foreground">{result.percentage >= 70 ? t("auth.no_typing") : "You can try again."}</p>
              <div className={`text-4xl font-bold mt-2 ${result.percentage >= 70 ? "text-mint-600" : "text-bubblegum-600"}`}>{result.score} / {result.max_score}</div>
              <div className="text-sm text-muted-foreground mt-2">{result.percentage}%</div>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="w-full px-6 py-3 rounded-lg bg-blueberry text-white font-medium hover:bg-blueberry/90 transition-colors"
            >
              {t("common.back")}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
