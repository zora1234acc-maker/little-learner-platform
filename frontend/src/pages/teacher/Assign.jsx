import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Clock, UserCheck } from "lucide-react";

export function TeacherAssign() {
  const { t } = useTranslation();
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [itemType, setItemType] = useState("lesson");
  const [itemId, setItemId] = useState("");
  const [students, setStudents] = useState([]);
  const [dueDate, setDueDate] = useState("");
  const [title, setTitle] = useState("");
  const [instructions, setInstructions] = useState("");

  const allStudents = [
    { id: "u3", full_name: "Sophal", avatar: "bear" },
    { id: "u4", full_name: "Sophea", avatar: "cat" }
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
    setStudents(allStudents); // mock: assign to all
    navigate("/teacher/grading");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <nav className="flex items-center gap-2">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 p-2 rounded-md border border-border hover:bg-accent">
          <ArrowLeft className="w-4 h-4" /> {t("common.back")}
        </button>
      </nav>

      <div className="rounded-xl border border-border bg-card p-6">
        <h1 className="text-2xl font-bold text-blueberry mb-6">Create Assignment</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Item Type</label>
            <div className="flex gap-2">
              {["lesson", "quiz", "assignment"].map((type) => (
                <button
                  key={type}
                  onClick={() => setItemType(type)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${itemType === type ? "bg-blueberry text-white border-blueberry" : "border border-border bg-background hover:bg-accent"}`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Select Item</label>
            <select
              value={itemId}
              onChange={(e) => setItemId(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-blueberry outline-none"
            >
              {currentItems.map((item) => (
                <option key={item.id} value={item.id}>{item.title[lang] || item.title.en}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-blueberry outline-none"
              placeholder="Assignment title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Instructions</label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-blueberry outline-none"
              placeholder="What should the student do?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-blueberry outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Assign to Students</label>
            <div className="space-y-2">
              {allStudents.map((s) => (
                <label key={s.id} className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-border text-blueberry focus:ring-blueberry" defaultChecked />
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center text-xs">{s.avatar}</span>
                    <span className="text-foreground">{s.full_name}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <button type="submit" className="w-full py-3 rounded-lg bg-blueberry text-white font-semibold hover:bg-blueberry/90 transition-colors">
            <UserCheck className="w-4 h-4 mr-2" /> Assign to Selected Students
          </button>
        </form>
      </div>
    </div>
  );
}
