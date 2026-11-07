import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { api } from "../../api/client";
import { useSite } from "../../context/SiteContext";

export function Subjects() {
  const { t } = useTranslation();
  const { menus, lang, t: siteT } = useSite();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.content.subjects.list().then((res) => {
      setSubjects(res.data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-blueberry">{t("nav.subjects")}</h1>
          <p className="text-muted-foreground">{siteT(subjects.length > 0 ? subjects[0].description : { en: "Choose a subject", km: "ជ្រើសមុខ", ar: "اختر مادة" })}</p>
        </div>
        <div className="flex gap-2">{menus.header.map((m) => (
          <Link key={m.id} to={m.url} className="px-3 py-1.5 rounded-md border border-border hover:bg-accent text-sm">{m.label}</Link>
        ))}</div>
      </header>

      {loading ? (
        <div className="text-center py-20 text-muted-foreground animate-pulse">{t("common.loading")}</div>
      ) : subjects.length === 0 ? (
        <div className="text-center py-20">{t("common.error")}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {subjects.map((sub) => {
            const coursesForSubject = []; // will be populated by course links
            return (
              <div key={sub.id} className="rounded-xl border border-border bg-card p-6 hover:shadow-md transition-shadow group">
                <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent transition-colors">
                  <span className="text-blueberry font-bold text-xl">{sub.position}</span>
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-2">{sub.title[lang] || sub.title.en}</h3>
                <p className="text-sm text-muted-foreground mb-4">{sub.description[lang] || sub.description.en}</p>
                <Link to={`/courses/${sub.id}`} className="inline-flex items-center gap-1 px-4 py-2 rounded-lg border border-blueberry text-blueberry font-medium text-sm hover:bg-blueberry hover:text-white transition-colors">
                  Browse <span className="text-xs">→</span>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
