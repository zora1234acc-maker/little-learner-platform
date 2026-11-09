import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BookOpen, Pencil, Plus, Trash2 } from "lucide-react";
import { api } from "@/api/client";
import { PageHeader } from "@/components/PageHeader";
import { Modal } from "@/components/Modal";
import { LocalizedField } from "@/components/LocalizedField";
import { useSite } from "@/context/SiteContext";

const emptyForm = {
  title: { en: "", km: "", ar: "" },
  description: { en: "", km: "", ar: "" },
  position: 1,
  is_published: true,
};

export function AdminContentSubjects() {
  const { t } = useTranslation();
  const { lang } = useSite();
  const [rows, setRows] = useState([]);
  const [langTab, setLangTab] = useState("en");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const result = await api.content.subjects.list();
    setRows(result.data);
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setForm({ ...emptyForm, position: rows.length + 1 });
    setModal({ type: "create" });
  };

  const openEdit = (subject) => {
    setForm({
      title: subject.title,
      description: subject.description,
      position: subject.position ?? 1,
      is_published: subject.is_published !== false,
    });
    setModal({ type: "edit", id: subject.id });
  };

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    if (modal.type === "create") await api.content.subjects.create(form);
    else await api.content.subjects.update(modal.id, form);
    setModal(null);
    setSaving(false);
    await load();
  };

  const remove = async (subject) => {
    if (window.confirm(`Delete "${subject.title?.en}"? Courses inside it are removed too.`)) {
      await api.content.subjects.remove(subject.id);
      await load();
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={t("nav.content")}
        title="Subjects"
        description="Top-level learning areas. Each subject holds courses."
        actions={
          <button onClick={openCreate} className="btn-primary touch-target">
            <Plus className="h-4 w-4" /> Add subject
          </button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {rows.map((subject) => (
          <article key={subject.id} className="card-md">
            <div className="flex items-start justify-between gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blueberry/10 text-blueberry">
                <BookOpen className="h-5 w-5" />
              </span>
              <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${subject.is_published !== false ? "bg-mint/10 text-[#16735D]" : "bg-muted/40 text-muted-foreground"}`}>
                {subject.is_published !== false ? "Published" : "Draft"}
              </span>
            </div>
            <h3 className="mt-3 font-bold text-foreground">{subject.title?.[lang] || subject.title?.en}</h3>
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{subject.description?.[lang] || subject.description?.en}</p>
            <div className="mt-4 flex items-center gap-2">
              <button onClick={() => openEdit(subject)} className="btn-secondary min-h-[40px] flex-1 px-3 py-2 text-sm">
                <Pencil className="h-3.5 w-3.5" /> Edit
              </button>
              <button onClick={() => remove(subject)} className="touch-target rounded-lg p-2 text-muted-foreground hover:bg-bubblegum/10 hover:text-bubblegum" aria-label="Delete subject">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </article>
        ))}
        {rows.length === 0 ? <div className="card text-center text-muted-foreground">No subjects yet.</div> : null}
      </div>

      <Modal
        open={Boolean(modal)}
        onClose={() => setModal(null)}
        title={modal?.type === "edit" ? "Edit subject" : "Add subject"}
        description="Titles and descriptions are stored in English, Khmer and Arabic."
        wide
      >
        <form onSubmit={save} className="space-y-4">
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
              {saving ? "Saving..." : "Save subject"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
