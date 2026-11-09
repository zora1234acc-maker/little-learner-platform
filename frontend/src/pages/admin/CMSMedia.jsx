import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Check, Copy, ImagePlus, Upload } from "lucide-react";
import { api } from "@/api/client";
import { PageHeader } from "@/components/PageHeader";

export function AdminCmsMedia() {
  const { t } = useTranslation();
  const [assets, setAssets] = useState([]);
  const [copied, setCopied] = useState(null);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);

  const load = async () => {
    const result = await api.media.list();
    setAssets(result.data);
  };

  useEffect(() => {
    load();
  }, []);

  const copy = async (asset) => {
    try {
      await navigator.clipboard.writeText(asset.url);
      setCopied(asset.id);
      setTimeout(() => setCopied(null), 1600);
    } catch {
      setCopied(asset.id);
    }
  };

  const upload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const url = URL.createObjectURL(file);
    await api.media.add({ name: file.name, url, type: file.type, size: file.size, alt: file.name });
    await load();
    setUploading(false);
    event.target.value = "";
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={t("nav.cms")}
        title="Media library"
        description="Images available to the site. Files live in public/asset/images and are referenced by path."
        actions={
          <>
            <button onClick={() => inputRef.current?.click()} className="btn-primary touch-target">
              <Upload className="h-4 w-4" /> {uploading ? "Uploading..." : "Upload image"}
            </button>
            <input ref={inputRef} type="file" accept="image/*" onChange={upload} className="hidden" />
          </>
        }
      />

      <div className="rounded-xl border border-sunshine/40 bg-sunshine/15 px-4 py-3 text-sm text-[#6B5200]">
        Tip: use the copy button, then paste the path into a logo, avatar or content field. Example:
        <span className="ms-1 font-mono">/asset/images/user.png</span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {assets.map((asset) => (
          <article key={asset.id} className="card-md overflow-hidden p-0">
            <div className="aspect-[2/1] overflow-hidden bg-muted/40">
              <img src={asset.url} alt={asset.alt || asset.name} className="h-full w-full object-cover" loading="lazy" />
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="truncate font-bold text-foreground">{asset.name}</h3>
                  <p className="truncate text-xs text-muted-foreground">{asset.type}</p>
                </div>
                <button
                  type="button"
                  onClick={() => copy(asset)}
                  className="touch-target rounded-lg border border-border p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
                  aria-label={`Copy path for ${asset.name}`}
                >
                  {copied === asset.id ? <Check className="h-4 w-4 text-mint" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
              <p className="mt-2 truncate rounded-lg bg-muted/40 px-2.5 py-1.5 font-mono text-[11px] text-muted-foreground">
                {asset.url}
              </p>
            </div>
          </article>
        ))}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex min-h-[220px] flex-col items-center justify-center gap-2 rounded-[var(--radius-lg)] border-2 border-dashed border-border bg-card p-6 text-muted-foreground transition hover:border-blueberry/40 hover:bg-blueberry/5 hover:text-blueberry"
        >
          <ImagePlus className="h-8 w-8" />
          <span className="text-sm font-bold">Add another image</span>
          <span className="text-xs">PNG, JPG or SVG</span>
        </button>
      </div>
    </div>
  );
}
