import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BookOpen, Pencil, Play, Plus, Trash2 } from "lucide-react";
import { api } from "@/api/client";
import { PageHeader } from "@/components/PageHeader";
import { Modal } from "@/components/Modal";
import { LocalizedField } from "@/components/LocalizedField";
import { useSite } from "@/context/SiteContext";

const emptyForm = {
  course_id: "",
  type: "reading",
  title: { en: "", km: "", ar: "" },
  body: { en: "", km: "", ar: "" },
  video_url: "",
  position: 1,
  is_published: true,
};

export function AdminContentLessons() {
  const { t } = useTranslation();
  const { lang } = useSite();
  const [rows, setRows] = useState([]);
  const [courses, setCourses] = useState([]);
  const [langTab, setLangTab] = useState("en");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const [lessonRes, courseRes] = await Promise.all([api.content.lessons.list(), api.content.courses.list()]);
    setRows(lessonRes.data);
    setCourses(courseRes.data);
  };

  useEffect(() => {
    load();
  }, []);

  const courseName = (id) => {
    const course = courses.find((item) => item.id === id);
    return course?.title?.[lang] || course?.title?.en || "—";
  };

  const openCreate = () => {
    setForm({ ...emptyForm, course_id: courses[0]?.id || "", position: rows.length + 1 });
    setModal({ type: "create" });
  };

  const openEdit = (lesson) => {
    setForm({
      course_id: lesson.course_id,
      type: lesson.type || "reading",
      title: lesson.title,
      body: lesson.body || { en: "", km: "", ar: "" },
      video_url: lesson.video_url || "",
      position: lesson.position ?? 1,
      is_published: lesson.is_published !== false,
    });
    setModal({ type: "edit", id: lesson.id });
  };

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    if (modal.type === "create") await api.content.lessons.create(form);
    else await api.content.lessons.update(modal.id, form);
    setModal(null);
    setSaving(false);
    await load();
  };

  const remove = async (lesson) => {
    if (window.confirm(`Delete "${lesson.title?.en}"? Quizzes linked to it are removed too.`)) {
      await api.content.lessons.remove(lesson.id);
      await load();
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={t("nav.content")}
        title="Lessons"
        description="Reading and video lessons. Lesson body supports simple HTML."
        actions={
          <button onClick={openCreate} className="btn-primary touch-target">
            <Plus className="h-4 w-4" /> Add lesson
          </button>
        }
      />

      <div className="space-y-3">
        {rows.map((lesson) => (
          <article key={lesson.id} className="card-sm flex flex-wrap items-center gap-3">
            <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${lesson.type === "video" ? "bg-sky/15 text-[#2B6CB0]" : "bg-blueberry/10 text-blueberry"}`}>
              {lesson.type === "video" ? <Play className="h-5 w-5" /> : <BookOpen className="h-5 w-5" />}
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-bold text-foreground">{lesson.title?.[lang] || lesson.title?.en}</h3>
              <p className="text-xs text-muted-foreground">
                {courseName(lesson.course_id)} · {lesson.type} · {lesson.is_published !== false ? "Published" : "Draft"}
              </p>
            </div>
            <button onClick={() => openEdit(lesson)} className="btn-secondary min-h-[40px] px-3 py-2 text-sm">
              <Pencil className="h-3.5 w-3.5" /> Edit
            </button>
            <button onClick={() => remove(lesson)} className="touch-target rounded-lg p-2 text-muted-foreground hover:bg-bubblegum/10 hover:text-bubblegum" aria-label="Delete lesson">
              <Trash2 className="h-4 w-4" />
            </button>
          </article>
        ))}
        {rows.length === 0 ? <div className="card text-center text-muted-foreground">No lessons yet.</div> : null}
      </div>

      <Modal
        open={Boolean(modal)}
        onClose={() => setModal(null)}
        title={modal?.type === "edit" ? "Edit lesson" : "Add lesson"}
        description="Write the lesson in all three languages. Students see their selected language."
        wide
      >
        <form onSubmit={save} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="field-label">Course</label>
              <select value={form.course_id} onChange={(event) => setForm({ ...form, course_id: event.target.value })} className="input-field" required>
                <option value="">Choose a course</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>{course.title?.en}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="field-label">Lesson type</label>
              <select value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })} className="input-field">
                <option value="reading">Reading</option>
                <option value="video">Video</option>
              </select>
            </div>
          </div>

          <LocalizedField
            label="Title"
            value={form.title}
            onChange={(value) => setForm({ ...form, title: value })}
            lang={langTab}
            onLangChange={setLangTab}
            required
          />
          <LocalizedField
            label="Lesson body (HTML)"
            value={form.body}
            onChange={(value) => setForm({ ...form, body: value })}
            lang={langTab}
            onLangChange={setLangTab}
            textarea
            rows={7}
            hint="Use <p>, <strong>, <ul> and <li>. HTML is rendered in the lesson player."
          />

          <div>
            <label className="field-label">Video embed URL (optional)</label>
            <input
              value={form.video_url || ""}
              onChange={(event) => setForm({ ...form, video_url: event.target.value })}
              className="input-field"
              placeholder="https://www.youtube.com/embed/..."
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="field-label">Position</label>
              <input type="number" min="1" value={form.position} onChange={(event) => setForm({ ...form, position: Number(event.target.value) })} className="input-field" />
            </div>
            <label className="mt-8 flex items-center gap-2 text-sm font-medium">
              <input type="checkbox" checked={form.is_published !== false} onChange={(event) => setForm({ ...form, is_published: event.target.checked })} className="h-4 w-4 rounded border-border" />
              Published
            </label>
          </div>

          <div className="flex justify-end gap-2 border-t border-border pt-4">
            <button type="button" onClick={() => setModal(null)} className="btn-ghost">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary min-h-[44px] px-6 py-2.5">
              {saving ? "Saving..." : "Save lesson"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
