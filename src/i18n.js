import i18n from "i18next";import { initReactI18next } from "react-i18next";
import translationEN from "./locales/en.json";
import translationTR from "./locales/tr.json";

// Translations
const resources = {
  en: { translation: translationEN },
  tr: { translation: translationTR },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en", // default language
  fallbackLng: "en",
  interpolation: {
    escapeValue: false, // React already protects from XSS
  },
});

export default i18n;
