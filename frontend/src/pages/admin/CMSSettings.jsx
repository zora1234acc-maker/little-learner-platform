import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Check, Image, Save } from "lucide-react";
import { api } from "@/api/client";
import { PageHeader } from "@/components/PageHeader";
import { LocalizedField } from "@/components/LocalizedField";
import { useSite } from "@/context/SiteContext";

const colorFields = [
  ["primary", "Primary"],
  ["accent", "Accent"],
  ["success", "Success"],
  ["warning", "Warning"],
  ["info", "Info"],
  ["background", "Background"],
];

export function AdminCmsSettings() {
  const { t } = useTranslation();
  const { reload } = useSite();
  const [lang, setLang] = useState("en");
  const [media, setMedia] = useState([]);
  const [form, setForm] = useState(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([api.cms.settings.get(), api.media.list()]).then(([settings, assets]) => {
      setForm(settings.data);
      setMedia(assets.data);
    });
  }, []);

  if (!form) {
    return <div className="animate-pulse py-20 text-center text-muted-foreground">Loading settings...</div>;
  }

  const set = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
    setSaved(false);
  };

  const setNested = (group, key, value) => {
    setForm((current) => ({ ...current, [group]: { ...current[group], [key]: value } }));
    setSaved(false);
  };

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    await api.cms.settings.update({
      site_name: form.site_name,
      tagline: form.tagline,
      logo_url: form.logo_url,
      favicon_url: form.favicon_url,
      brand_colors: form.brand_colors,
      contact: form.contact,
      social: form.social,
      retention_days_activity: Number(form.retention_days_activity),
      retention_days_deactivated: Number(form.retention_days_deactivated),
      privacy_page_slug: form.privacy_page_slug,
      retention_page_slug: form.retention_page_slug,
    });
    await reload();
    setSaving(false);
    setSaved(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={t("nav.cms")}
        title="Site settings"
        description="The site name, tagline, colors and contact details used across the public website."
      />

      <form onSubmit={save} className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <section className="card-md">
            <h3 className="text-lg font-bold text-foreground">Identity</h3>
            <div className="mt-4 space-y-4">
              <div>
                <label className="field-label">Site name</label>
                <input value={form.site_name} onChange={(event) => set("site_name", event.target.value)} className="input-field" required />
              </div>

              <LocalizedField
                label="Tagline"
                value={form.tagline}
                onChange={(value) => set("tagline", value)}
                lang={lang}
                onLangChange={setLang}
                hint="Shown in the footer and page metadata."
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="field-label">Logo image</label>
                  <input
                    value={form.logo_url || ""}
                    onChange={(event) => set("logo_url", event.target.value)}
                    className="input-field"
                    placeholder="/asset/images/..."
                  />
                </div>
                <div>
                  <label className="field-label">Favicon</label>
                  <input
                    value={form.favicon_url || ""}
                    onChange={(event) => set("favicon_url", event.target.value)}
                    className="input-field"
                    placeholder="/asset/images/..."
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {media.map((asset) => (
                  <button
                    key={asset.id}
                    type="button"
                    onClick={() => set("logo_url", asset.url)}
                    className={`overflow-hidden rounded-xl border-2 ${
                      form.logo_url === asset.url ? "border-blueberry" : "border-border"
                    }`}
                    title={`Use ${asset.name} as the logo`}
                  >
                    <img src={asset.url} alt={asset.alt || asset.name} className="h-14 w-24 object-cover" />
                  </button>
                ))}
                {media.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No media files yet.</p>
                ) : null}
              </div>
            </div>
          </section>

          <section className="card-md">
            <h3 className="text-lg font-bold text-foreground">Brand colors</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {colorFields.map(([key, label]) => (
                <label key={key} className="flex items-center gap-3 rounded-xl border border-border bg-background p-3">
                  <input
                    type="color"
                    value={form.brand_colors?.[key] || "#4A4C96"}
                    onChange={(event) => setNested("brand_colors", key, event.target.value)}
                    className="h-9 w-10 cursor-pointer rounded border-0 bg-transparent"
                  />
                  <span className="min-w-0">
                    <span className="block text-sm font-bold text-foreground">{label}</span>
                    <span className="block font-mono text-xs text-muted-foreground">{form.brand_colors?.[key]}</span>
                  </span>
                </label>
              ))}
            </div>
          </section>

          <section className="card-md">
            <h3 className="text-lg font-bold text-foreground">Contact and social</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="field-label">Email</label>
                <input value={form.contact?.email || ""} onChange={(event) => setNested("contact", "email", event.target.value)} className="input-field" />
              </div>
              <div>
                <label className="field-label">Phone</label>
                <input value={form.contact?.phone || ""} onChange={(event) => setNested("contact", "phone", event.target.value)} className="input-field" />
              </div>
              <div className="sm:col-span-2">
                <label className="field-label">Address</label>
                <input value={form.contact?.address || ""} onChange={(event) => setNested("contact", "address", event.target.value)} className="input-field" />
              </div>
              <div>
                <label className="field-label">Facebook URL</label>
                <input value={form.social?.facebook || ""} onChange={(event) => setNested("social", "facebook", event.target.value)} className="input-field" />
              </div>
              <div>
                <label className="field-label">Telegram URL</label>
                <input value={form.social?.telegram || ""} onChange={(event) => setNested("social", "telegram", event.target.value)} className="input-field" />
              </div>
            </div>
          </section>

          <section className="card-md">
            <h3 className="text-lg font-bold text-foreground">Privacy and retention</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="field-label">Delete inactive activity after (days)</label>
                <input
                  type="number"
                  min="1"
                  value={form.retention_days_activity}
                  onChange={(event) => set("retention_days_activity", event.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="field-label">Delete deactivated accounts after (days)</label>
                <input
                  type="number"
                  min="1"
                  value={form.retention_days_deactivated}
                  onChange={(event) => set("retention_days_deactivated", event.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="field-label">Privacy page slug</label>
                <input value={form.privacy_page_slug} onChange={(event) => set("privacy_page_slug", event.target.value)} className="input-field" />
              </div>
              <div>
                <label className="field-label">Retention page slug</label>
                <input value={form.retention_page_slug} onChange={(event) => set("retention_page_slug", event.target.value)} className="input-field" />
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <section className="card-md">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Live preview</h3>
            <div className="mt-4 rounded-2xl border border-border bg-background p-5 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-blueberry/10 text-blueberry">
                {form.logo_url ? (
                  <img src={form.logo_url} alt="Logo preview" className="h-full w-full object-cover" />
                ) : (
                  <Image className="h-7 w-7" />
                )}
              </div>
              <h4 className="mt-3 text-xl font-black text-foreground">{form.site_name || "Site name"}</h4>
              <p className="mt-1 text-sm text-muted-foreground">{form.tagline?.[lang] || form.tagline?.en}</p>
              <div className="mt-4 flex justify-center gap-2">
                {(form.brand_colors ? Object.entries(form.brand_colors) : []).slice(0, 5).map(([key, value]) => (
                  <span key={key} className="h-6 w-6 rounded-full border border-border" style={{ backgroundColor: value }} title={key} />
                ))}
              </div>
              <p className="mt-4 text-xs text-muted-foreground">{form.contact?.email}</p>
            </div>
          </section>

          <button type="submit" disabled={saving} className="btn-primary w-full">
            {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
            {saving ? "Saving..." : saved ? "Saved" : "Save settings"}
          </button>
          <p className="text-center text-xs text-muted-foreground">
            Refresh the public site to see the change.
          </p>
        </div>
      </form>
    </div>
  );
}
