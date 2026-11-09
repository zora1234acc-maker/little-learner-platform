import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../api/client";
import i18n from "../i18n";
import siteSettingsDefault from "../data/siteSettings.json";

const SiteContext = createContext(null);

export function SiteProvider({ children }) {
  const [settings, setSettings] = useState(siteSettingsDefault);
  const [menus, setMenus] = useState({ header: [], footer: [] });
  const [footerBlocks, setFooterBlocks] = useState([]);
  const [lang, setLang] = useState("en");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedLang = localStorage.getItem("lang");
    const savedLang = storedLang === "km" ? "km" : "en";
    setLang(savedLang);
    if (i18n.language !== savedLang) i18n.changeLanguage(savedLang);
    loadSite(savedLang);
  }, []);

  // Keep <html lang dir> in sync with the active language.
  useEffect(() => {
    document.documentElement.setAttribute("lang", lang);
    document.documentElement.setAttribute("dir", "ltr");
  }, [lang]);

  const loadSite = async (language) => {
    try {
      const [siteRes, headerRes, footerRes, blocksRes] = await Promise.all([
        api.public.site({ lang: language }),
        api.public.menus({ lang: language, location: "header" }),
        api.public.menus({ lang: language, location: "footer" }),
        api.public.footerBlocks({ lang: language }),
      ]);
      setSettings(siteRes.data.settings || siteSettingsDefault);
      setMenus({
        header: headerRes.data.filter((m) => m.is_visible !== false),
        footer: footerRes.data.filter((m) => m.is_visible !== false),
      });
      setFooterBlocks(blocksRes.data || []);
    } catch (error) {
      console.warn("Failed to load site data", error);
      setSettings(siteSettingsDefault);
      setMenus({ header: [], footer: [] });
      setFooterBlocks([]);
    } finally {
      setLoading(false);
    }
  };

  const changeLang = (newLang) => {
    const nextLang = newLang === "km" ? "km" : "en";
    setLang(nextLang);
    localStorage.setItem("lang", nextLang);
    i18n.changeLanguage(nextLang);
    loadSite(nextLang);
  };

  const value = {
    settings,
    menus,
    footerBlocks,
    lang,
    loading,
    changeLang,
    reload: () => loadSite(lang),
    t: (field) => {
      if (!field) return "";
      if (typeof field === "string") return field;
      return field[lang] || field.en || "";
    },
  };

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export const useSite = () => {
  const context = useContext(SiteContext);
  if (!context) throw new Error("useSite must be used within SiteProvider");
  return context;
};
