import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "../../api/client";

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
    return <div className="text-center py-20 text-muted-foreground animate-pulse">{t("common.loading")}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-blueberry">{page.title}</h1>
      {page.sections.map((section) => (
        <div key={section.id} className="prose prose-sm max-w-none text-foreground" dangerouslySetInnerHTML={{ __html: section.content }} />
      ))}
    </div>
  );
}
