import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, BookOpen, Search, Calculator, FlaskConical, Palette, Globe2, Music2 } from "lucide-react";
import { api } from "@/api/client";
import { useSite } from "@/context/SiteContext";

const icons = [BookOpen, Calculator, FlaskConical, Palette, Globe2, Music2];

export function Subjects() {
  const { t } = useTranslation();
  const { lang } = useSite();
  const [subjects, setSubjects] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.content.subjects
      .list({ publishedOnly: true })
      .then((result) => setSubjects(result.data))
      .finally(() => setLoading(false));
  }, []);

  const filtered = subjects.filter((subject) => {
    const title = subject.title?.[lang] || subject.title?.en || "";
    const description = subject.description?.[lang] || subject.description?.en || "";
    return `${title} ${description}`.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-10">
      <header className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <span className="eyebrow">{t("nav.subjects")}</span>
          <h1 className="mb-3 text-3xl font-black text-blueberry sm:text-4xl">{t("nav.subjects")}</h1>
          <p className="max-w-xl text-muted-foreground">{t("home.featured_desc")}</p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder={t("common.search")}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="input-field w-full ps-11"
          />
        </div>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div key={item} className="card h-48 animate-pulse bg-muted/20" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-24 text-center text-muted-foreground">
          <BookOpen className="mx-auto mb-3 h-8 w-8" />
          <p className="text-lg">No subjects found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((subject, index) => {
            const title = subject.title?.[lang] || subject.title?.en;
            const desc = subject.description?.[lang] || subject.description?.en;
            const SubjectIcon = icons[index % icons.length];
            return (
              <Link
                key={subject.id}
                to={`/courses/${subject.id}`}
                className="card-md group flex flex-col border-s-4 border-blueberry transition hover:border-sunshine"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="icon-md bg-blueberry/10 text-blueberry"><SubjectIcon className="h-5 w-5" /></span>
                  <span className="rounded-full bg-muted/40 px-2.5 py-1 text-[11px] font-bold text-muted-foreground">
                    Subject
                  </span>
                </div>
                <h3 className="text-lg font-bold text-foreground">{title}</h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">{desc}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-blueberry">
                  {t("home.open_subject")} <ArrowRight className="flip-rtl h-4 w-4 transition group-hover:translate-x-0.5" />
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
