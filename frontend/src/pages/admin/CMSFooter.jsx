import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2 } from "lucide-react";
import { api } from "@/api/client";
import { PageHeader } from "@/components/PageHeader";
import { Modal } from "@/components/Modal";
import { LocalizedField } from "@/components/LocalizedField";
import { useSite } from "@/context/SiteContext";

const emptyBlock = {
  title: { en: "", km: "", ar: "" },
  content: { en: "", km: "", ar: "" },
};

export function AdminCmsFooter() {
  const { t } = useTranslation();
  const { reload } = useSite();
  const [blocks, setBlocks] = useState([]);
  const [lang, setLang] = useState("en");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyBlock);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const result = await api.cms.footer.list();
    setBlocks(result.data);
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setForm(emptyBlock);
    setModal({ type: "create" });
  };

  const openEdit = (block) => {
    setForm({ title: block.title, content: block.content });
    setModal({ type: "edit", id: block.id });
  };

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    if (modal.type === "create") await api.cms.footer.create(form);
    else await api.cms.footer.update(modal.id, form);
    setModal(null);
    setSaving(false);
    await load();
    await reload();
  };

  const remove = async (block) => {
    if (window.confirm(`Delete the "${block.title?.en}" footer block?`)) {
      await api.cms.footer.remove(block.id);
      await load();
      await reload();
    }
  };

  const move = async (block, direction) => {
    await api.cms.footer.move(block.id, direction);
    await load();
    await reload();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={t("nav.cms")}
        title="Footer blocks"
        description="Short text blocks shown above the copyright line."
        actions={
          <button onClick={openCreate} className="btn-primary touch-target">
            <Plus className="h-4 w-4" /> Add block
          </button>
        }
      />

      <div className="flex justify-end gap-2">
        {["en", "km", "ar"].map((value) => (
          <button
            key={value}
            onClick={() => setLang(value)}
            className={`min-h-[38px] rounded-lg px-3 text-xs font-bold uppercase ${
              lang === value ? "bg-white text-blueberry shadow-sm ring-1 ring-border" : "text-muted-foreground hover:bg-accent"
            }`}
          >
            {value}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {blocks.map((block) => (
          <article key={block.id} className="card-md">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-bold text-foreground">{block.title?.[lang] || block.title?.en}</h3>
              <div className="flex gap-1">
                <button onClick={() => move(block, "up")} className="touch-target rounded-lg p-2 text-muted-foreground hover:bg-accent" aria-label="Move up">
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>
                <button onClick={() => move(block, "down")} className="touch-target rounded-lg p-2 text-muted-foreground hover:bg-accent" aria-label="Move down">
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
                <button onClick={() => openEdit(block)} className="touch-target rounded-lg p-2 text-muted-foreground hover:bg-accent" aria-label="Edit">
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button onClick={() => remove(block)} className="touch-target rounded-lg p-2 text-muted-foreground hover:bg-bubblegum/10 hover:text-bubblegum" aria-label="Delete">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">{block.content?.[lang] || block.content?.en}</p>
          </article>
        ))}
        {blocks.length === 0 ? <div className="card text-center text-muted-foreground">{t("admin.cms.no_footer_blocks")}</div> : null}
      </div>

      <Modal
        open={Boolean(modal)}
        onClose={() => setModal(null)}
        title={modal?.type === "edit" ? "Edit footer block" : "Add footer block"}
        description="Each block is translated into English, Khmer and Arabic."
        wide
      >
        <form onSubmit={save} className="space-y-4">
          <LocalizedField
            label="Title"
            value={form.title}
            onChange={(value) => setForm({ ...form, title: value })}
            lang={lang}
            onLangChange={setLang}
            required
          />
          <LocalizedField
            label="Content"
            value={form.content}
            onChange={(value) => setForm({ ...form, content: value })}
            lang={lang}
            onLangChange={setLang}
            textarea
            rows={4}
            required
          />

          <div className="flex justify-end gap-2 border-t border-border pt-4">
            <button type="button" onClick={() => setModal(null)} className="btn-ghost">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary min-h-[44px] px-6 py-2.5">
              {saving ? "Saving..." : "Save block"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
