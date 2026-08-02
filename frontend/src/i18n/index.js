import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from '../locales/en.json';
import fr from '../locales/fr.json';
import es from '../locales/es.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
      es: { translation: es },
    },
    fallbackLng: 'en',
    supportedLngs: ['en', 'fr', 'es'],
    interpolation: { escapeValue: false }, // React already escapes
    detection: {
      // A person's explicit choice (via the language switcher) always wins
      // on their next visit; browser language is only used the very first
      // time, before they've ever chosen.
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'th_language',
      caches: ['localStorage'],
    },
  });

export default i18n;
