import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Search } from "lucide-react";
import { api } from "@/api/client";
import { SectionDivider } from "@/components/SectionDivider";

export function Subjects() {
  const { t } = useTranslation();
  const lang = localStorage.getItem("lang") || "en";
  const [search, setSearch] = useState("");

  const allSubjects = [
    { id: "sub1", title: { en: "Khmer Language", km: "ភាសាខ្មែរ", ar: "اللغة الخميرية" }, description: { en: "Learn to read and write Khmer", km: "រៀនអាននិងសរសេរខ្មែរ", ar: "تعلم قراءة وكتابة اللغة الخميرية" }, icon: "📖" },
    { id: "sub2", title: { en: "Mathematics", km: "គណិតវិជ្ជា", ar: "الرياضيات" }, description: { en: "Basic math for early learners", km: "គណិតមួយរបស់កុមារចាប់ផ្តើម", ar: "رياضيات أساسية للمتعلمين المبتدئين" }, icon: "🔢" },
    { id: "sub3", title: { en: "Science", km: "វិទ្យាសាស្ត្រ", ar: "العلوم" }, description: { en: "Explore the world around us", km: "ស្វែងរកពិភពលោកនៅក្នុងយើង", ar: "استكشف العالم من حولنا" }, icon: "🔬" }
  ];

  const filtered = allSubjects.filter((s) =>
    s.title[lang].toLowerCase().includes(search.toLowerCase()) ||
    s.description[lang].toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <span className="eyebrow">{t("nav.subjects")}</span>
          <h1 className="text-3xl font-black text-blueberry mb-3">{t("nav.subjects")}</h1>
          <p className="text-muted-foreground leading-relaxed">{t("home.cards.languages.desc")}</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={t("common.search")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field w-full pl-11"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="py-24 text-center text-muted-foreground">
          <p className="text-lg">No subjects found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((sub) => {
            const title = sub.title[lang] || sub.title.en;
            const desc = sub.description[lang] || sub.description.en;
            return (
              <a
                key={sub.id}
                href={`/courses/${sub.id}`}
                className="card-sm group border-l-4 border-blueberry hover:border-sunshine transition-colors"
              >
                <div className="icon-md bg-blueberry/10 text-blueberry mb-4">
                  {sub.icon}
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
