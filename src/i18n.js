import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translationEN from "./locales/en.json";
import translationTR from "./locales/tr.json";

// Translations
const resources = {
  en: { translation: translationEN },
  tr: { translation: translationTR },
};

// Get saved language or default to English
const getInitialLanguage = () => {
  const savedLanguage = localStorage.getItem("selectedLanguage");
  if (!savedLanguage) {
    localStorage.setItem("selectedLanguage", "en");
  }
  return savedLanguage || "en";
};

i18n.use(initReactI18next).init({
  resources,
  lng: getInitialLanguage(),
  fallbackLng: "en",
  interpolation: {
    escapeValue: false, // React already protects from XSS
  },
});

// Save language changes to localStorage
i18n.on("languageChanged", (lng) => {
  localStorage.setItem("selectedLanguage", lng);
});

export default i18n;
