import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, UserCheck } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Avatar } from "@/components/Avatar";
import { api } from "@/api/client";
import { useAuth } from "@/context/AuthContext";
import { useSite } from "@/context/SiteContext";

export function TeacherAssign() {
  const { t } = useTranslation();
  const { lang } = useSite();
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [itemType, setItemType] = useState("lesson");
  const [itemId, setItemId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [title, setTitle] = useState("");
  const [instructions, setInstructions] = useState("");
  const [selected, setSelected] = useState([]);
  const [students, setStudents] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [courseName, setCourseName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [created, setCreated] = useState(null);

  useEffect(() => {
    let live = true;
    const load = async () => {
      try {
        const [classRes, lessonRes, quizRes, courseRes] = await Promise.all([
          api.progress.class(user.id),
          api.content.lessons.list({ publishedOnly: true }),
          api.content.quizzes.list({ publishedOnly: true }),
          api.content.courses.list(),
        ]);
        if (!live) return;

        const courseLessons = courseId
          ? lessonRes.data.filter((lesson) => lesson.course_id === courseId)
          : lessonRes.data;
        const lessonIds = new Set(courseLessons.map((lesson) => lesson.id));
        const courseQuizzes = courseId
          ? quizRes.data.filter((quiz) => lessonIds.has(quiz.lesson_id))
          : quizRes.data;

        setStudents(classRes.data);
        setSelected(classRes.data.map((student) => student.id));
        setLessons(courseLessons);
        setQuizzes(courseQuizzes);
        const course = courseRes.data.find((item) => item.id === courseId);
        setCourseName(course ? course.title?.[lang] || course.title?.en : "");
      } catch {
        if (live) setError("Could not load the library. Please refresh.");
      } finally {
        if (live) setLoading(false);
      }
    };
    load();
    return () => {
      live = false;
    };
  }, [user.id, courseId, lang]);

  const text = (field) => (typeof field === "string" ? field : field?.[lang] || field?.en || "");
  const options = itemType === "lesson" ? lessons : quizzes;

  useEffect(() => {
    if (options.length > 0) {
      setItemId((current) => (options.some((item) => item.id === current) ? current : options[0].id));
    } else {
      setItemId("");
    }
  }, [itemType, lessons, quizzes]); // eslint-disable-line react-hooks/exhaustive-deps

  const selectedItem = useMemo(
    () => options.find((item) => item.id === itemId) || null,
    [options, itemId]
  );

  // Suggest a title from the selected lesson/quiz.
  useEffect(() => {
    if (selectedItem && !title) setTitle(text(selectedItem.title));
  }, [selectedItem]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleStudent = (id) => {
    setSelected((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    if (!itemId) {
      setError("Choose a lesson or quiz first.");
      return;
    }
    if (selected.length === 0) {
      setError("Select at least one student.");
      return;
    }
    setSaving(true);
    try {
      const body = title || text(selectedItem?.title);
      const res = await api.assignments.create({
        item_type: itemType,
        item_id: itemId,
        assigned_by: user.id,
        due_date: dueDate || null,
        title: { en: body, km: body, ar: body },
        instructions: {
          en: instructions || "Complete this activity.",
          km: instructions || "បញ្ចប់សកម្មភាពនេះ។",
          ar: instructions || "أكمل هذا النشاط.",
        },
        student_ids: selected,
      });
      setCreated(res.data);
    } catch {
      setError("Could not create the assignment. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (created) {
    return (
      <div className="mx-auto max-w-md space-y-6 py-16">
        <div className="rounded-[var(--radius-xl)] border border-border bg-card p-8 text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-mint/20 text-[#1B7F66]">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h1 className="text-2xl font-black text-blueberry">{t("teacher.assign.assignment_created")}</h1>
          <p className="mt-2 text-muted-foreground">
            Sent to {created.targets.length} student{created.targets.length === 1 ? "" : "s"}.
          </p>
          <p className="mt-3 rounded-xl bg-muted/40 px-4 py-3 text-sm font-bold text-foreground">
            {text(created.title)}
          </p>

          <div className="mt-6 flex flex-col gap-2">
            <Link to="/teacher/class-progress" className="btn-primary min-h-[44px]">
              View class progress
            </Link>
            <button
              type="button"
              onClick={() => {
                setCreated(null);
                setTitle("");
                setInstructions("");
                setDueDate("");
              }}
              className="btn-secondary min-h-[44px]"
            >
              Create another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <nav className="flex items-center gap-2">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1 rounded-lg border border-border p-2 text-sm font-bold text-muted-foreground hover:bg-accent"
        >
          <ArrowLeft className="flip-rtl h-4 w-4" /> {t("common.back")}
        </button>
      </nav>

      <PageHeader
        eyebrow={t("nav.assign")}
        title="Create assignment"
        description={
          courseName
            ? `Assign a lesson or quiz from "${courseName}" to your linked students.`
            : "Pick a lesson or quiz and assign it to your linked students."
        }
      />

      <form onSubmit={submit} className="card-md space-y-5">
        {error ? (
          <p className="rounded-xl border border-bubblegum/40 bg-bubblegum/10 px-4 py-3 text-sm text-bubblegum">
            {error}
          </p>
        ) : null}

        <div>
          <label className="field-label">{t("teacher.assign.item_type")}</label>
          <div className="flex gap-2">
            {["lesson", "quiz"].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => {
                  setItemType(type);
                  setTitle("");
                }}
                className={`min-h-[44px] flex-1 rounded-xl border text-sm font-bold capitalize ${
                  itemType === type
                    ? "border-blueberry bg-blueberry text-white"
                    : "border-border bg-background text-muted-foreground hover:bg-accent"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="field-label">{t("teacher.assign.select", { itemType })}</label>
          <select
            value={itemId}
            onChange={(event) => {
              setItemId(event.target.value);
              const chosen = options.find((item) => item.id === event.target.value);
              if (chosen) setTitle(text(chosen.title));
            }}
            className="input-field"
            disabled={loading}
          >
            {options.map((item) => (
              <option key={item.id} value={item.id}>
                {text(item.title)}
              </option>
            ))}
          </select>
          {!loading && options.length === 0 ? (
            <p className="mt-2 text-xs text-bubblegum">
              No {itemType}s are available for this selection.
            </p>
          ) : null}
        </div>

        <div>
          <label className="field-label">{t("teacher.assign.assignment_title")}</label>
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="input-field"
            placeholder="Assignment title"
            required
          />
        </div>

        <div>
          <label className="field-label">{t("teacher.assign.instructions")}</label>
          <textarea
            value={instructions}
            onChange={(event) => setInstructions(event.target.value)}
            rows={3}
            className="input-field"
            placeholder="What should the student do?"
          />
        </div>

        <div>
          <label className="field-label">{t("teacher.assign.due_date")}</label>
          <input
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
            className="input-field"
          />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className="field-label mb-0">{t("teacher.assign.assign_to_students")}</label>
            <button
              type="button"
              onClick={() =>
                setSelected(
                  selected.length === students.length ? [] : students.map((student) => student.id)
                )
              }
              className="text-xs font-bold text-blueberry hover:underline"
            >
              {selected.length === students.length ? t("teacher.assign.clear_all") : t("teacher.assign.select_all")}
            </button>
          </div>

          <div className="mt-2 space-y-2">
            {students.map((student) => (
              <label
                key={student.id}
                className="flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-background px-3 py-2.5"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(student.id)}
                  onChange={() => toggleStudent(student.id)}
                  className="h-4 w-4 rounded border-border text-blueberry"
                />
                <Avatar src={student.avatar_url} name={student.avatar} size="sm" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold text-foreground">
                    {student.full_name}
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    {student.grade || "Grade 1"} · {student.class_name || "1A"}
                  </span>
                </span>
              </label>
            ))}
            {!loading && students.length === 0 ? (
              <p className="rounded-xl bg-muted/40 px-4 py-4 text-center text-sm text-muted-foreground">
                {t("teacher.assign.no_students_linked")}
              </p>
            ) : null}
          </div>
        </div>

        <button
          type="submit"
          disabled={saving || !itemId || selected.length === 0}
          className={`btn-primary w-full min-h-[48px] ${
            saving || !itemId || selected.length === 0 ? "cursor-not-allowed opacity-50" : ""
          }`}
        >
          <UserCheck className="h-4 w-4" />
          {saving ? "Creating..." : `Assign to ${selected.length} student${selected.length === 1 ? "" : "s"}`}
        </button>
      </form>
    </div>
  );
}
