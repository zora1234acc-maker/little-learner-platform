import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, UserCheck } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

export function TeacherAssign() {
  const { t } = useTranslation();
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [itemType, setItemType] = useState("lesson");
  const [itemId, setItemId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [title, setTitle] = useState("");
  const [instructions, setInstructions] = useState("");

  const allStudents = [
    { id: "u3", full_name: "Sophal", avatar: "🐻" },
    { id: "u4", full_name: "Sophea", avatar: "🐱" }
  ];

  const items = {
    lesson: [
      { id: "l1", title: { en: "First Consonant: ក", km: "អក្សរដើម៖ ក" } },
      { id: "l2", title: { en: "Counting 1 to 5", km: "គណនា 1 ដល់ 5" } },
      { id: "l3", title: { en: "Parts of a Plant", km: "បច្ចុប្បន្នភាពរបស់ស្លឹង" } }
    ],
    quiz: [
      { id: "q1", title: { en: "Khmer Alphabet Quiz", km: "ប្រអប់អក្សរខ្មែរ" } },
      { id: "q2", title: { en: "Counting Quiz", km: "ប្រអប់គណនា" } }
    ]
  };

  const lang = localStorage.getItem("lang") || "en";
  const currentItems = items[itemType];

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/teacher/grading");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <nav className="flex items-center gap-2 mb-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 p-2 rounded-lg border border-border hover:bg-accent">
          <ArrowLeft className="w-4 h-4" /> {t("common.back")}
        </button>
      </nav>

      <div className="card">
        <PageHeader eyebrow={t("nav.assign")} title="Create Assignment" />

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="field-label">Item Type</label>
            <div className="flex gap-2">
              {["lesson", "quiz", "assignment"].map((type) => (
                <button
                  key={type}
                  onClick={() => setItemType(type)}
                  className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${itemType === type ? "bg-blueberry text-white border-blueberry" : "border border-border bg-background hover:bg-accent"} touch-target`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="field-label">Select Item</label>
            <select
              value={itemId}
              onChange={(e) => setItemId(e.target.value)}
              className="input-field"
            >
              {currentItems.map((item) => (
                <option key={item.id} value={item.id}>{item.title[lang] || item.title.en}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="field-label">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field"
              placeholder="Assignment title"
            />
          </div>

          <div>
            <label className="field-label">Instructions</label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows={3}
              className="input-field h-24"
              placeholder="What should the student do?"
            />
          </div>

          <div>
            <label className="field-label">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="input-field"
            />
          </div>

          <div>
            <label className="field-label">Assign to Students</label>
            <div className="space-y-2">
              {allStudents.map((s) => (
                <label key={s.id} className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-border text-blueberry focus:ring-blueberry" defaultChecked />
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-muted/40 flex items-center justify-center text-xs">{s.avatar}</span>
                    <span className="text-foreground">{s.full_name}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <button type="submit" className="w-full btn-primary touch-target">
            <UserCheck className="w-4 h-4 mr-2" /> Assign to Selected Students
          </button>
        </form>
      </div>
    </div>
  );
}
