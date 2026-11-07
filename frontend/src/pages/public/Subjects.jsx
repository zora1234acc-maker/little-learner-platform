import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Search } from "lucide-react";
import { api } from "../../api/client";
import { useSite } from "../../context/SiteContext";

export function Subjects() {
  const { t } = useTranslation();
  const { lang, t: siteT } = useSite();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const allSubjects = [
    { id: "sub1", title: { en: "Khmer Language", km: "ភាសាខ្មែរ", ar: "اللغة الخميرية" }, description: { en: "Learn to read and write Khmer", km: "រៀនអាននិងសរសេរខ្មែរ", ar: "تعلم قراءة وكتابة اللغة الخميرية" } },
    { id: "sub2", title: { en: "Mathematics", km: "គណិតវិជ្ជា", ar: "الرياضيات" }, description: { en: "Basic math for early learners", km: "គណិតមួយរបស់កុមារចាប់ផ្តើម", ar: "رياضيات أساسية للمتعلمين المبتدئين" } },
    { id: "sub3", title: { en: "Science", km: "វិទ្យាសាស្ត្រ", ar: "العلوم" }, description: { en: "Explore the world around us", km: "ស្វែងរកពិភពលោកនៅក្នុងយើង", ar: "استكشف العالم من حولنا" } }
  ];

  const filtered = allSubjects.filter((s) =>
    s.title[lang].toLowerCase().includes(search.toLowerCase()) ||
    s.description[lang].toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="text-center py-20 text-muted-foreground animate-pulse">{t("common.loading")}</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="eyebrow">{t("nav.subjects")}</span>
          <h1 className="text-2xl font-bold text-blueberry mb-2">Choose a subject</h1>
          <p className="text-muted-foreground">{t("home.cards.languages.desc")}</p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={t("common.search")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-blueberry focus:border-transparent outline-none text-base"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="py-20 text-center text-muted-foreground">
          <p>No subjects found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filtered.map((sub) => {
            const title = sub.title[lang] || sub.title.en;
            const desc = sub.description[lang] || sub.description.en;
            return (
              <a
                key={sub.id}
                href={`/courses/${sub.id}`}
                className="card group border-l-4 border-blueberry hover:border-sunshine transition-colors"
              >
                <div className="card-icon bg-blueberry/10 text-blueberry group-hover:bg-sunshine transition-colors">
                  <span className="text-xl">{sub.id === "sub1" ? "📖" : sub.id === "sub2" ? "🔢" : "🔬"}</span>
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
