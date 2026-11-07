import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Clock, Play, FileText, CheckCircle2 } from "lucide-react";

export function StudentTodo() {
  const { t } = useTranslation();

  const assignments = [
    { id: "a1", title: { en: "Learn Khmer Alphabet", km: "រៀនអក្សរខ្មែរ", ar: "تعلم الحروف الخميرية" }, type: "lesson", due: "Nov 20", status: "not_started" },
    { id: "a2", title: { en: "Khmer Consonant Quiz", km: "ប្រអប់អក្សរដែលមានអាណត្តិទិន", ar: "اختبار الساكنات الخميرية" }, type: "quiz", due: "Nov 25", status: "not_started" },
    { id: "a3", title: { en: "Draw a Plant", km: "គូរស្លឹង", ar: "ارسم نباتًا" }, type: "assignment", due: "Dec 01", status: "submitted" }
  ];

  const lang = localStorage.getItem("lang") || "en";

  const statusColors = {
    not_started: "bg-muted/50 text-muted-foreground",
    in_progress: "bg-sunshine/10 text-sunshine-700 border-sunshine/20",
    submitted: "bg-sky/10 text-sky-700 border-sky/20",
    graded: "bg-mint/10 text-mint-700 border-mint/20"
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-blueberry">My To-do</h1>
        <p className="text-muted-foreground">Your assignments and lessons.</p>
      </div>

      <div className="space-y-3">
        {assignments.map((a) => (
          <div key={a.id} className="flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:shadow-sm transition-shadow group">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${a.type === "lesson" ? "bg-blueberry-50 text-blueberry-600" : a.type === "quiz" ? "bg-sunshine-50 text-sunshine-600" : "bg-sky-50 text-sky-600"}`}>
                {a.type === "lesson" ? <Play className="w-5 h-5" /> : a.type === "quiz" ? <FileText className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{a.title[lang] || a.title.en}</h3>
                <p className="text-xs text-muted-foreground">{a.type} • Due {a.due}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-2 py-1 rounded text-xs font-medium border ${statusColors[a.status]}`}>
                {a.status.replace("_", " ")}
              </span>
              {a.status === "submitted" ? (
                <CheckCircle2 className="w-4 h-4 text-mint-600" />
              ) : (
                <Link to={`/student/assign/${a.id}`} className="px-4 py-2 rounded-lg bg-blueberry text-white text-sm font-medium hover:bg-blueberry/90 transition-colors">
                  Start
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
