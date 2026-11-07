import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";

const LANGUAGES = [
  { code: "en", label: "English", rtl: false },
  { code: "km", label: "ភាសាខ្មែរ", rtl: false },
  { code: "ar", label: "العربية", rtl: true },
];

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const [dir, setDir] = useState("ltr");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const currentLang = i18n.language;
    const lang = LANGUAGES.find((l) => l.code === currentLang);
    const newDir = lang ? (lang.rtl ? "rtl" : "ltr") : "ltr";
    setDir(newDir);
    document.documentElement.setAttribute("dir", newDir);
    document.documentElement.setAttribute("lang", currentLang);
    if (newDir === "rtl") {
      document.body.classList.add("rtl");
    } else {
      document.body.classList.remove("rtl");
    }
  }, [i18n.language]);

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    setOpen(false);
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-background text-foreground hover:bg-accent transition-colors"
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium">{t("common.language")}</span>
        <span className="ml-auto text-xs text-muted-foreground">
          {LANGUAGES.find((l) => l.code === i18n.language)?.rtl ? "RTL" : "LTR"}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 rounded-lg border border-border bg-background text-foreground shadow-lg py-2 z-50">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${i18n.language === lang.code ? "bg-primary text-primary-foreground" : "hover:bg-accent hover:text-accent-foreground"}`}
            >
              <span>{lang.label}</span>
              <span className="ml-auto text-xs">{lang.rtl ? "RTL" : "LTR"}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
