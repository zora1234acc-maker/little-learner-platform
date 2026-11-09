import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Check, ExternalLink, Plus, Save, Trash2 } from "lucide-react";
import { api } from "@/api/client";
import { PageHeader } from "@/components/PageHeader";
import { LocalizedField } from "@/components/LocalizedField";
import { useSite } from "@/context/SiteContext";

const sectionTypes = ["hero", "subjects", "steps", "cta", "richtext"];

const blankSection = (position) => ({
  id: `s${Date.now()}`,
  type: "richtext",
  position,
  content: { en: "", km: "", ar: "" },
});

const blankStepsSection = (position) => ({
  id: `s${Date.now()}`,
  type: "steps",
  position,
  content: {
    en: { title: "", items: [{ title: "", desc: "" }] },
    km: { title: "", items: [{ title: "", desc: "" }] },
    ar: { title: "", items: [{ title: "", desc: "" }] },
  },
});

function SectionFields({ section, index, lang, onChangeContent, onReplaceSection }) {
  const content = section.content?.[lang] ?? (typeof section.content?.[lang] === "string" ? "" : {});

  const setField = (key, value) => {
    const base = content && typeof content === "object" ? content : {};
    onChangeContent(index, lang, { ...base, [key]: value });
  };

  if (section.type === "richtext") {
    return (
      <LocalizedField
        label="Rich text (HTML allowed)"
        value={section.content}
        onChange={(value) => onReplaceSection(index, { ...section, content: value })}
        lang={lang}
        textarea
        rows={6}
      />
    );
  }

  if (section.type === "hero") {
    return (
      <div className="space-y-3">
        <div>
          <label className="field-label">Title</label>
          <input value={content.title || ""} onChange={(event) => setField("title", event.target.value)} className="input-field" dir="ltr" />
        </div>
        <div>
          <label className="field-label">Subtitle</label>
          <textarea value={content.subtitle || ""} onChange={(event) => setField("subtitle", event.target.value)} rows={2} className="input-field" dir="ltr" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="field-label">Button label</label>
            <input value={content.cta || ""} onChange={(event) => setField("cta", event.target.value)} className="input-field" />
          </div>
          <div>
            <label className="field-label">Button URL</label>
            <input value={content.cta_url || ""} onChange={(event) => setField("cta_url", event.target.value)} className="input-field" />
          </div>
        </div>
      </div>
    );
  }

  if (section.type === "cta") {
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="field-label">Title</label>
          <input value={content.title || ""} onChange={(event) => setField("title", event.target.value)} className="input-field" />
        </div>
        <div>
          <label className="field-label">Button label</label>
          <input value={content.cta || ""} onChange={(event) => setField("cta", event.target.value)} className="input-field" />
        </div>
        <div className="sm:col-span-2">
          <label className="field-label">Button URL</label>
          <input value={content.cta_url || ""} onChange={(event) => setField("cta_url", event.target.value)} className="input-field" />
        </div>
      </div>
    );
  }

  if (section.type === "subjects") {
    return (
      <div className="space-y-3">
        <div>
          <label className="field-label">Title</label>
          <input value={content.title || ""} onChange={(event) => setField("title", event.target.value)} className="input-field" />
        </div>
        <div>
          <label className="field-label">Description</label>
          <textarea value={content.description || ""} onChange={(event) => setField("description", event.target.value)} rows={2} className="input-field" />
        </div>
      </div>
    );
  }

  if (section.type === "steps") {
    const items = content.items || [];
    const setItem = (itemIndex, key, value) => {
      const next = items.map((item, i) => (i === itemIndex ? { ...item, [key]: value } : item));
      setField("items", next);
    };
    return (
      <div className="space-y-3">
        <div>
          <label className="field-label">Title</label>
          <input value={content.title || ""} onChange={(event) => setField("title", event.target.value)} className="input-field" />
        </div>
        <div className="space-y-2">
          {items.map((item, itemIndex) => (
            <div key={itemIndex} className="rounded-xl border border-border bg-background p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground">Step {itemIndex + 1}</span>
                <button
                  type="button"
                  onClick={() => setField("items", items.filter((_, i) => i !== itemIndex))}
                  className="rounded p-1.5 text-muted-foreground hover:bg-bubblegum/10 hover:text-bubblegum"
                  aria-label="Remove step"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <input
                value={item.title || ""}
                onChange={(event) => setItem(itemIndex, "title", event.target.value)}
                className="input-field mt-2"
                placeholder="Step title"
              />
              <input
                value={item.desc || ""}
                onChange={(event) => setItem(itemIndex, "desc", event.target.value)}
                className="input-field mt-2"
                placeholder="Step description"
              />
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setField("items", [...items, { title: "", desc: "" }])}
          className="btn-ghost text-xs"
        >
          <Plus className="h-3.5 w-3.5" /> Add step
        </button>
      </div>
    );
  }

  return (
    <pre className="overflow-x-auto rounded-xl bg-muted/40 p-3 text-xs text-muted-foreground">
      {JSON.stringify(section.content, null, 2)}
    </pre>
  );
}

export function AdminCmsPages() {
  const { t } = useTranslation();
  const { reload } = useSite();
  const [pages, setPages] = useState([]);
  const [selected, setSelected] = useState("home");
  const [draft, setDraft] = useState(null);
  const [lang, setLang] = useState("en");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const load = async () => {
    const result = await api.cms.pages.list();
    setPages(result.data);
    const page = result.data.find((item) => item.slug === selected) || result.data[0];
    if (page) setDraft(JSON.parse(JSON.stringify(page)));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const sections = useMemo(
    () => (draft?.sections ? [...draft.sections].sort((a, b) => (a.position ?? 0) - (b.position ?? 0)) : []),
    [draft]
  );

  if (!draft) {
    return <div className="animate-pulse py-20 text-center text-muted-foreground">Loading pages...</div>;
  }

  const setSectionContent = (index, sectionLang, value) => {
    setSaved(false);
    setDraft((current) => {
      const next = [...current.sections];
      const slot = next.findIndex((section) => section.id === sections[index]?.id);
      if (slot === -1) return current;
      next[slot] = {
        ...next[slot],
        content: { ...(next[slot].content || {}), [sectionLang]: value },
      };
      return { ...current, sections: next };
    });
  };

  const replaceSection = (index, value) => {
    setSaved(false);
    setDraft((current) => {
      const next = [...current.sections];
      const slot = next.findIndex((section) => section.id === sections[index]?.id);
      if (slot === -1) return current;
      next[slot] = value;
      return { ...current, sections: next };
    });
  };

  const setSectionType = (index, type) => {
    setSaved(false);
    setDraft((current) => {
      const next = [...current.sections];
      const slot = next.findIndex((section) => section.id === sections[index]?.id);
      if (slot === -1) return current;
      next[slot] = { ...next[slot], type };
      return { ...current, sections: next };
    });
  };

  const addSection = () => {
    setSaved(false);
    const section = blankSection(sections.length + 1);
    setDraft((current) => ({ ...current, sections: [...current.sections, section] }));
  };

  const addStepsSection = () => {
    setSaved(false);
    const section = blankStepsSection(sections.length + 1);
    setDraft((current) => ({ ...current, sections: [...current.sections, section] }));
  };

  const removeSection = (index) => {
    setSaved(false);
    setDraft((current) => {
      const next = [...current.sections];
      const slot = next.findIndex((section) => section.id === sections[index]?.id);
      if (slot === -1) return current;
      next.splice(slot, 1);
      return { ...current, sections: next };
    });
  };

  const save = async () => {
    setSaving(true);
    await api.cms.pages.update(draft.slug, {
      title: draft.title,
      status: draft.status,
      sections: draft.sections,
    });
    await reload();
    setSaving(false);
    setSaved(true);
  };

  const publicPath = draft.slug === "home" ? "/" : `/${draft.slug}`;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={t("nav.cms")}
        title="Pages"
        description="Edit the homepage, About, Contact and privacy pages. Sections are translated per language."
        actions={
          <>
            <Link to={publicPath} target="_blank" className="btn-secondary min-h-[44px] px-5 py-2.5 text-sm">
              <ExternalLink className="h-4 w-4" /> View page
            </Link>
            <button onClick={addStepsSection} className="btn-ghost">
              <Plus className="h-4 w-4" /> Add steps section
            </button>
            <button onClick={addSection} className="btn-primary min-h-[44px] px-5 py-2.5 text-sm">
              <Plus className="h-4 w-4" /> Add section
            </button>
          </>
        }
      />

      <div className="flex flex-wrap gap-2">
        {pages.map((page) => (
          <button
            key={page.id}
            onClick={() => setSelected(page.slug)}
            className={`min-h-[40px] rounded-xl px-4 text-sm font-bold ${
              selected === page.slug ? "bg-blueberry text-white" : "border border-border bg-card text-muted-foreground hover:bg-accent"
            }`}
          >
            {page.title?.en || page.slug}
          </button>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <section className="card-md space-y-4">
          <h3 className="text-lg font-bold text-foreground">Page settings</h3>

          <div>
            <label className="field-label">Slug</label>
            <input value={draft.slug} className="input-field bg-muted/30" readOnly />
          </div>

          <LocalizedField
            label="Page title"
            value={draft.title}
            onChange={(value) => {
              setSaved(false);
              setDraft({ ...draft, title: value });
            }}
            lang={lang}
            onLangChange={setLang}
          />

          <div>
            <label className="field-label">Status</label>
            <select
              value={draft.status}
              onChange={(event) => {
                setSaved(false);
                setDraft({ ...draft, status: event.target.value });
              }}
              className="input-field"
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          <div className="rounded-xl bg-muted/30 p-3 text-xs leading-6 text-muted-foreground">
            Public URL: <span className="font-mono text-foreground">{publicPath}</span>
            <br />
            Editing language: <span className="font-bold uppercase text-foreground">{lang}</span>
          </div>

          <button onClick={save} disabled={saving} className="btn-primary w-full">
            {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
            {saving ? "Saving..." : saved ? "Saved" : "Save page"}
          </button>
        </section>

        <section className="space-y-4">
          {sections.map((section, index) => (
            <article key={section.id} className="card-md">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-blueberry/10 px-2.5 py-1 text-[11px] font-bold text-blueberry">
                    #{index + 1}
                  </span>
                  <select
                    value={section.type}
                    onChange={(event) => setSectionType(index, event.target.value)}
                    className="rounded-lg border border-border bg-background px-3 py-2 text-xs font-bold"
                  >
                    {sectionTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={() => removeSection(index)}
                  className="touch-target rounded-lg p-2 text-muted-foreground hover:bg-bubblegum/10 hover:text-bubblegum"
                  aria-label="Remove section"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4">
                <SectionFields
                  section={section}
                  index={index}
                  lang={lang}
                  onChangeContent={setSectionContent}
                  onReplaceSection={replaceSection}
                />
              </div>
            </article>
          ))}
          {sections.length === 0 ? (
            <div className="card text-center text-muted-foreground">This page has no sections. Add one.</div>
          ) : null}
        </section>
      </div>
    </div>
  );
}
