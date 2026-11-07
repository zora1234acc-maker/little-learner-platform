import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Paperclip, CheckCircle2, Clock } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

export function AssignmentSubmit() {
  const { t } = useTranslation();
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const lang = localStorage.getItem("lang") || "en";

  const [submissionType, setSubmissionType] = useState("text"); // text | file
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const assignments = {
    a1: {
      id: "a1",
      title: { en: "Learn Khmer Alphabet", km: "រៀនអក្សរខ្មែរ", ar: "تعلم الحروف الخميرية" },
      type: "lesson",
      instructions: { en: "Read the lesson and write what you learned", km: "អានបុរាណរៀន និងសរសេរអំណរមុខ", ar: "اقرأ الدرس واكتب ما تعلمته" },
      due: "Nov 20",
    },
    a2: {
      id: "a2",
      title: { en: "Khmer Consonant Quiz", km: "ប្រអប់អក្សរដែលមានអាណត្តិទិន", ar: "اختبار الساكنات الخميرية" },
      type: "quiz",
      instructions: { en: "Answer all questions carefully", km: "ឆ្លើយសំណួរទាំងអស់ជាងច្រើន", ar: "أجب على جميع الأسئلة بعناية" },
      due: "Nov 25",
    },
    a3: {
      id: "a3",
      title: { en: "Draw a Plant", km: "គូរស្លឹង", ar: "ارسم نباتًا" },
      type: "assignment",
      instructions: { en: "Draw a plant with roots, stem and leaves. Upload a photo.", km: "គូរស្លឹងដោយមានរង្វាន់។ ធ្លាប់។ និងបញ្ចេញ។ ផ្ដល់រូបថត។", ar: "ارسم نباتًا به جذور وسيقان وأوراق. ارفع صورة." },
      due: "Dec 01",
    }
  };

  const assignment = assignments[assignmentId] || assignments.a1;
  const title = assignment.title[lang] || assignment.title.en;
  const instructions = assignment.instructions[lang] || assignment.instructions.en;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-md mx-auto space-y-6 py-20">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-mint/20 text-mint flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-black text-blueberry">{t("common.submitted")}</h1>
          <p className="text-muted-foreground">Your work has been submitted. Your teacher will review it soon.</p>
        </div>
        <Link to="/student/todo" className="btn-primary w-full">
          Back to To-do
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-4">
      <nav className="flex items-center gap-2">
        <Link to="/student/todo" className="flex items-center gap-1 p-2 rounded-[var(--radius-md)] border border-border hover:bg-accent">
          <ArrowLeft className="w-4 h-4" /> {t("common.back")}
        </Link>
      </nav>

      <PageHeader
        eyebrow={t("nav.assign")}
        title={title}
        description={instructions}
      />

      <SectionDivider />

      <div className="rounded-[var(--radius-xl)] border border-border bg-card p-8">
        <h3 className="font-semibold text-lg text-foreground mb-6">Submit your work</h3>

        <div className="space-y-4 mb-8">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="radio" name="type" value="text" checked={submissionType === "text"} onChange={() => setSubmissionType("text")} className="accent-blueberry" />
            <span className="text-sm font-medium text-foreground group-hover:text-blueberry transition-colors">Write your answer</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="radio" name="type" value="file" checked={submissionType === "file"} onChange={() => setSubmissionType("file")} className="accent-blueberry" />
            <span className="text-sm font-medium text-foreground group-hover:text-blueberry transition-colors">Upload a file</span>
          </label>
        </div>

        {submissionType === "text" ? (
          <div className="space-y-3">
            <label className="field-label">Your answer</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={6}
              className="input-field h-48"
              placeholder="Type your answer here..."
            />
            <p className="text-xs text-muted-foreground">Write your answer in your own words.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <label className="field-label">Upload file</label>
            <div className="border border-border border-dashed rounded-[var(--radius-lg)] p-6 text-center hover:bg-accent/50 transition-colors cursor-pointer group" onClick={(e) => { e.preventDefault(); }}>
              <Paperclip className="w-6 h-6 text-muted-foreground group-hover:text-blueberry mb-3" />
              <p className="text-sm text-foreground">Click to upload or drag and drop</p>
              <p className="text-xs text-muted-foreground">PDF, JPG, PNG up to 5MB</p>
            </div>
            <input type="file" className="hidden" onChange={(e) => setFile(e.target.files[0])} />
            {file && (
              <div className="flex items-center gap-3 p-3 rounded-[var(--radius-md)] bg-muted/50">
                <Paperclip className="w-4 h-4 text-blueberry" />
                <span className="text-sm text-foreground truncate">{file.name}</span>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 flex gap-3">
          <button
            onClick={handleSubmit}
            disabled={submissionType === "text" ? !text : !file}
            className={`flex-1 btn-primary ${(submissionType === "text" ? !text : !file) ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {t("common.submit")}
          </button>
          <Link to="/student/todo" className="btn-ghost flex-1">
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
}
