import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowDown, ArrowUp, Eye, EyeOff, Pencil, Plus, Trash2 } from "lucide-react";
import { api } from "@/api/client";
import { PageHeader } from "@/components/PageHeader";
import { Modal } from "@/components/Modal";
import { LocalizedField } from "@/components/LocalizedField";
import { useSite } from "@/context/SiteContext";

const emptyItem = {
  label: { en: "", km: "", ar: "" },
  url: "/",
  parent_id: "",
  is_visible: true,
};

export function AdminCmsMenus() {
  const { t } = useTranslation();
  const { reload } = useSite();
  const [location, setLocation] = useState("header");
  const [items, setItems] = useState([]);
  const [lang, setLang] = useState("en");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyItem);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const result = await api.cms.menus.list({ location });
    setItems(result.data);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const topLevel = useMemo(
    () => items.filter((item) => !item.parent_id).sort((a, b) => (a.position ?? 0) - (b.position ?? 0)),
    [items]
  );

  const openCreate = () => {
    setForm({ ...emptyItem });
    setModal({ type: "create" });
  };

  const openEdit = (item) => {
    setForm({
      label: item.label || { en: "", km: "", ar: "" },
      url: item.url || "/",
      parent_id: item.parent_id || "",
      is_visible: item.is_visible !== false,
    });
    setModal({ type: "edit", id: item.id });
  };

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    const payload = { ...form, parent_id: form.parent_id || null };
    if (modal.type === "create") await api.cms.menus.create(location, payload);
    else await api.cms.menus.update(modal.id, payload);
    setModal(null);
    setSaving(false);
    await load();
    await reload();
  };

  const remove = async (item) => {
    if (window.confirm(`Remove "${item.label?.en || "menu item"}" and its children?`)) {
      await api.cms.menus.remove(item.id);
      await load();
      await reload();
    }
  };

  const toggleVisible = async (item) => {
    await api.cms.menus.update(item.id, { is_visible: item.is_visible === false });
    await load();
    await reload();
  };

  const move = async (item, direction) => {
    await api.cms.menus.move(item.id, direction);
    await load();
    await reload();
  };

  const renderItem = (item, isChild = false) => {
    const hidden = item.is_visible === false;
    return (
      <div
        key={item.id}
        className={`flex flex-wrap items-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5 ${
          isChild ? "ms-6" : ""
        } ${hidden ? "opacity-60" : ""}`}
      >
        <span className="flex min-w-0 flex-1 items-center gap-2">
          <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${isChild ? "bg-muted/50 text-muted-foreground" : "bg-blueberry/10 text-blueberry"}`}>
            {isChild ? "Child" : "Top"}
          </span>
          <span className="truncate text-sm font-bold text-foreground">{item.label?.[lang] || item.label?.en}</span>
          <span className="hidden truncate text-xs text-muted-foreground sm:inline">{item.url}</span>
          {hidden ? <span className="text-[11px] font-bold text-muted-foreground">hidden</span> : null}
        </span>

        <div className="flex items-center gap-1">
          {!isChild ? (
            <>
              <button onClick={() => move(item, "up")} className="touch-target rounded-lg p-2 text-muted-foreground hover:bg-accent" aria-label="Move up">
                <ArrowUp className="h-3.5 w-3.5" />
              </button>
              <button onClick={() => move(item, "down")} className="touch-target rounded-lg p-2 text-muted-foreground hover:bg-accent" aria-label="Move down">
                <ArrowDown className="h-3.5 w-3.5" />
              </button>
            </>
          ) : null}
          <button onClick={() => toggleVisible(item)} className="touch-target rounded-lg p-2 text-muted-foreground hover:bg-accent" aria-label="Toggle visibility">
            {hidden ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          </button>
          <button onClick={() => openEdit(item)} className="touch-target rounded-lg p-2 text-muted-foreground hover:bg-accent" aria-label="Edit">
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button onClick={() => remove(item)} className="touch-target rounded-lg p-2 text-muted-foreground hover:bg-bubblegum/10 hover:text-bubblegum" aria-label="Delete">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={t("nav.cms")}
        title="Menus"
        description="Header and footer links. Children appear as a dropdown under their parent."
        actions={
          <button onClick={openCreate} className="btn-primary touch-target">
            <Plus className="h-4 w-4" /> Add menu item
          </button>
        }
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          {["header", "footer"].map((value) => (
            <button
              key={value}
              onClick={() => setLocation(value)}
              className={`min-h-[42px] rounded-xl px-5 text-sm font-bold capitalize ${
                location === value ? "bg-blueberry text-white" : "border border-border bg-card text-muted-foreground hover:bg-accent"
              }`}
            >
              {value} menu
            </button>
          ))}
        </div>

        <div className="flex gap-2">
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
      </div>

      <div className="space-y-2">
        {topLevel.map((item) => (
          <div key={item.id} className="space-y-2">
            {renderItem(item)}
            {items
              .filter((child) => child.parent_id === item.id)
              .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
              .map((child) => renderItem(child, true))}
          </div>
        ))}
        {topLevel.length === 0 ? (
          <div className="card text-center text-muted-foreground">No menu items. Add the first one.</div>
        ) : null}
      </div>

      <Modal
        open={Boolean(modal)}
        onClose={() => setModal(null)}
        title={modal?.type === "edit" ? "Edit menu item" : "Add menu item"}
        description="Labels are stored in all three languages. The URL is the React route."
      >
        <form onSubmit={save} className="space-y-4">
          <LocalizedField
            label="Label"
            value={form.label}
            onChange={(value) => setForm({ ...form, label: value })}
            lang={lang}
            onLangChange={setLang}
            required
          />

          <div>
            <label className="field-label">URL / route</label>
            <input
              value={form.url}
              onChange={(event) => setForm({ ...form, url: event.target.value })}
              className="input-field"
              placeholder="/subjects"
              required
            />
          </div>

          <div>
            <label className="field-label">Parent item</label>
            <select
              value={form.parent_id || ""}
              onChange={(event) => setForm({ ...form, parent_id: event.target.value })}
              className="input-field"
            >
              <option value="">None (top level)</option>
              {topLevel
                .filter((item) => item.id !== modal?.id)
                .map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label?.en}
                  </option>
                ))}
            </select>
          </div>

          <label className="flex items-center gap-2 text-sm font-medium">
            <input
              type="checkbox"
              checked={form.is_visible !== false}
              onChange={(event) => setForm({ ...form, is_visible: event.target.checked })}
              className="h-4 w-4 rounded border-border"
            />
            Visible on the public site
          </label>

          <div className="flex justify-end gap-2 border-t border-border pt-4">
            <button type="button" onClick={() => setModal(null)} className="btn-ghost">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary min-h-[44px] px-6 py-2.5">
              {saving ? "Saving..." : "Save item"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
