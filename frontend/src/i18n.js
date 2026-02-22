import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files (we will create these)
import en from './locales/en.json';
import ar from './locales/ar.json';
import fr from './locales/fr.json';
import zh from './locales/zh.json';
import es from './locales/es.json';
import pt from './locales/pt.json';
import de from './locales/de.json';
import ru from './locales/ru.json';
import ja from './locales/ja.json';
import ko from './locales/ko.json';
import it from './locales/it.json';
import tr from './locales/tr.json';
import pl from './locales/pl.json';
import ms from './locales/ms.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ar: { translation: ar },
      fr: { translation: fr },
      zh: { translation: zh },
      es: { translation: es },
      pt: { translation: pt },
      de: { translation: de },
      ru: { translation: ru },
      ja: { translation: ja },
      ko: { translation: ko },
      it: { translation: it },
      tr: { translation: tr },
      pl: { translation: pl },
      ms: { translation: ms },
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'cookie', 'htmlTag', 'path', 'subdomain'],
      caches: ['localStorage'],
    },
  });

export default i18n;
