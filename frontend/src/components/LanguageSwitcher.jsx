import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";
import { useSite } from "../context/SiteContext";

const LANGUAGES = [
  { code: "en", label: "English", rtl: false },
  { code: "km", label: "ភាសាខ្មែរ", rtl: false },
  { code: "ar", label: "العربية", rtl: true },
];

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const { changeLang } = useSite();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const currentLang = i18n.language;
    const langInfo = LANGUAGES.find((l) => l.code === currentLang);
    const newDir = langInfo ? (langInfo.rtl ? "rtl" : "ltr") : "ltr";
    document.documentElement.setAttribute("dir", newDir);
    document.documentElement.setAttribute("lang", currentLang);
    document.body.classList.toggle("rtl", newDir === "rtl");
  }, [i18n.language]);

  const currentLang = i18n.language;
  const langInfo = LANGUAGES.find((l) => l.code === currentLang);
  const currentDir = langInfo ? (langInfo.rtl ? "rtl" : "ltr") : "ltr";

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    changeLang(code);
    setOpen(false);
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-background text-foreground hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-0"
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium">{t("common.language")}</span>
        <span className="ml-auto text-xs text-muted-foreground">
          {currentDir === "rtl" ? "RTL" : "LTR"}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl border border-border bg-background text-foreground shadow-lg py-2 z-50">
          {LANGUAGES.map((lng) => (
            <button
              key={lng.code}
              onClick={() => changeLanguage(lng.code)}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                currentLang === lng.code ? "bg-blueberry text-white" : "hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              <span>{lng.label}</span>
              <span className="ml-auto text-xs">{lng.rtl ? "RTL" : "LTR"}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
