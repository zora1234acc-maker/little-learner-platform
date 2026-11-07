import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "../../api/client";

export function Contact() {
  const { t } = useTranslation();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.public.pages({ slug: "contact", lang: localStorage.getItem("lang") || "en" })
      .then((res) => { setPage(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading || !page) {
    return (
      <div className="py-20">
        <span className="eyebrow">{t("nav.contact")}</span>
        <h1 className="text-2xl font-bold text-blueberry">{t("nav.contact")}</h1>
        <p className="text-muted-foreground animate-pulse">{t("common.loading")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <span className="eyebrow">{t("nav.contact")}</span>
      <h1 className="text-2xl font-bold text-blueberry">{page.title}</h1>
      {page.sections.map((section) => (
        <div key={section.id} className="prose prose-sm max-w-none text-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: section.content }} />
      ))}
    </div>
  );
}
