import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../api/client";

const SiteContext = createContext(null);

export function SiteProvider({ children }) {
  const [settings, setSettings] = useState(null);
  const [menus, setMenus] = useState({ header: [], footer: [] });
  const [lang, setLang] = useState("en");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedLang = localStorage.getItem("lang") || "en";
    setLang(savedLang);
    loadSite(savedLang);
  }, []);

  const loadSite = async (language) => {
    try {
      const [siteRes, menuRes] = await Promise.all([
        api.public.site({ lang: language }),
        api.public.menus({ lang: language })
      ]);
      setSettings(siteRes.data.settings);
      // Split menus by location
      const header = menuRes.data.filter((m) => m.url === "/" || m.label === "Home" || m.label === "ទំព័រដើម" || m.label === "الرئيسية" || m.position <= 4);
      const footer = menuRes.data.filter((m) => m.position > 4 || m.url.includes("privacy") || m.url.includes("retention") || m.label.includes("Privacy") || m.label.includes("Retention") || m.label.includes("ឯកជន") || m.label.includes("خصوصية"));
      setMenus({ header, footer });
    } catch (e) {
      console.warn("Failed to load site data", e);
      // fallback to defaults
      setSettings(siteSettingsDefault);
      setMenus({ header: [], footer: [] });
    } finally {
      setLoading(false);
    }
  };

  const changeLang = async (newLang) => {
    setLang(newLang);
    localStorage.setItem("lang", newLang);
    document.documentElement.setAttribute("lang", newLang);
    await loadSite(newLang);
    if (newLang === "ar") {
      document.documentElement.setAttribute("dir", "rtl");
      document.body.classList.add("rtl");
    } else {
      document.documentElement.setAttribute("dir", "ltr");
      document.body.classList.remove("rtl");
    }
    window.location.reload();
  };

  const value = {
    settings,
    menus,
    lang,
    loading,
    changeLang,
    t: (field) => {
      if (!field) return "";
      if (typeof field === "string") return field;
      return field[lang] || field.en || "";
    }
  };

  return (
    <SiteContext.Provider value={value}>
      {children}
    </SiteContext.Provider>
  );
}

export const useSite = () => {
  const context = useContext(SiteContext);
  if (!context) throw new Error("useSite must be used within SiteProvider");
  return context;
};

// Default fallback settings
const siteSettingsDefault = {
  site_name: "Little Learner",
  tagline: { en: "Free learning for every child", km: "ការរៀនមិនមានចំណងជើង", ar: "تعلم مجاني لكل طفل" },
  contact: { email: "hello@littlelearner.example", phone: "+855 12 345 678", address: "Phnom Penh, Cambodia" }
};
