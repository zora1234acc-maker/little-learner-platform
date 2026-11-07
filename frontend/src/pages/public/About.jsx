import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "@/api/client";
import { SectionDivider } from "@/components/SectionDivider";

export function About() {
  const { t } = useTranslation();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.public.pages({ slug: "about", lang: localStorage.getItem("lang") || "en" })
      .then((res) => { setPage(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading || !page) {
    return (
      <div className="py-24">
        <span className="eyebrow">{t("nav.about")}</span>
        <h1 className="text-3xl font-black text-blueberry">{t("nav.about")}</h1>
        <p className="text-muted-foreground animate-pulse">{t("common.loading")}</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-10">
      <span className="eyebrow">{t("nav.about")}</span>
      <h1 className="text-3xl font-black text-blueberry">{page.title}</h1>
      <SectionDivider />
      {page.sections.map((section) => (
        <div key={section.id} className="prose prose-sm max-w-none text-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: section.content }} />
      ))}
    </div>
  );
}
