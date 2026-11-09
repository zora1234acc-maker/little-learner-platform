import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./en.json";
import km from "./km.json";
import ar from "./ar.json";

const resources = {
  en: { translation: en },
  km: { translation: km },
  ar: { translation: ar },
};

const rtlLangs = ["ar"];

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    supportedLngs: ["en", "km", "ar"],
    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
    },
    interpolation: {
      escapeValue: false,
    },
  });

// Apply RTL direction for Arabic
if (rtlLangs.includes(i18n.language)) {
  document.documentElement.dir = "rtl";
  document.documentElement.lang = i18n.language;
}

i18n.on("languageChanged", (lng) => {
  const isRtl = rtlLangs.includes(lng);
  document.documentElement.dir = isRtl ? "rtl" : "ltr";
  document.documentElement.lang = lng;
});

export default i18n;
