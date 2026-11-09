import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { GraduationCap, Pencil, Plus, Trash2 } from "lucide-react";
import { api } from "@/api/client";
import { PageHeader } from "@/components/PageHeader";
import { Modal } from "@/components/Modal";
import { LocalizedField } from "@/components/LocalizedField";
import { useSite } from "@/context/SiteContext";

const emptyForm = {
  subject_id: "",
  title: { en: "", km: "", ar: "" },
  description: { en: "", km: "", ar: "" },
  position: 1,
  is_published: true,
};

export function AdminContentCourses() {
  const { t } = useTranslation();
  const { lang } = useSite();
  const [rows, setRows] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [langTab, setLangTab] = useState("en");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const [courseRes, subjectRes] = await Promise.all([api.content.courses.list(), api.content.subjects.list()]);
    setRows(courseRes.data);
    setSubjects(subjectRes.data);
  };

  useEffect(() => {
    load();
  }, []);

  const subjectName = (id) => {
    const subject = subjects.find((item) => item.id === id);
    return subject?.title?.[lang] || subject?.title?.en || "—";
  };

  const openCreate = () => {
    setForm({ ...emptyForm, subject_id: subjects[0]?.id || "", position: rows.length + 1 });
    setModal({ type: "create" });
  };

  const openEdit = (course) => {
    setForm({
      subject_id: course.subject_id,
      title: course.title,
      description: course.description || { en: "", km: "", ar: "" },
      position: course.position ?? 1,
      is_published: course.is_published !== false,
    });
    setModal({ type: "edit", id: course.id });
  };

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    if (modal.type === "create") await api.content.courses.create(form);
    else await api.content.courses.update(modal.id, form);
    setModal(null);
    setSaving(false);
    await load();
  };

  const remove = async (course) => {
    if (window.confirm(`Delete "${course.title?.en}"? Lessons inside it are removed too.`)) {
      await api.content.courses.remove(course.id);
      await load();
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={t("nav.content")}
        title="Courses"
        description="Courses belong to a subject. Each course holds lessons and quizzes."
        actions={
          <button onClick={openCreate} className="btn-primary touch-target">
            <Plus className="h-4 w-4" /> Add course
          </button>
        }
      />

      <div className="card-md overflow-x-auto p-0">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-bold">Course</th>
              <th className="px-4 py-3 font-bold">Subject</th>
              <th className="px-4 py-3 font-bold">Position</th>
              <th className="px-4 py-3 font-bold">Status</th>
              <th className="px-4 py-3 text-end font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((course) => (
              <tr key={course.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">
                  <span className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-mint/10 text-[#16735D]">
                      <GraduationCap className="h-4 w-4" />
                    </span>
                    <span>
                      <span className="block font-bold text-foreground">{course.title?.[lang] || course.title?.en}</span>
                      <span className="block text-xs text-muted-foreground">{course.description?.[lang] || course.description?.en}</span>
                    </span>
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{subjectName(course.subject_id)}</td>
                <td className="px-4 py-3 text-muted-foreground">{course.position}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${course.is_published !== false ? "bg-mint/10 text-[#16735D]" : "bg-muted/40 text-muted-foreground"}`}>
                    {course.is_published !== false ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <button onClick={() => openEdit(course)} className="touch-target rounded-lg p-2 text-muted-foreground hover:bg-accent" aria-label="Edit course">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={() => remove(course)} className="touch-target rounded-lg p-2 text-muted-foreground hover:bg-bubblegum/10 hover:text-bubblegum" aria-label="Delete course">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">No courses yet.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <Modal
        open={Boolean(modal)}
        onClose={() => setModal(null)}
        title={modal?.type === "edit" ? "Edit course" : "Add course"}
        description="Courses are translated into English, Khmer and Arabic."
        wide
      >
        <form onSubmit={save} className="space-y-4">
          <div>
            <label className="field-label">Subject</label>
            <select value={form.subject_id} onChange={(event) => setForm({ ...form, subject_id: event.target.value })} className="input-field" required>
              <option value="">Choose a subject</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>{subject.title?.en}</option>
              ))}
            </select>
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
            label="Description"
            value={form.description}
            onChange={(value) => setForm({ ...form, description: value })}
            lang={langTab}
            onLangChange={setLangTab}
            textarea
            rows={3}
          />

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
              {saving ? "Saving..." : "Save course"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
