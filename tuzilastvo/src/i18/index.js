import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
    .use(HttpBackend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init( {
        fallbackLng: 'en',
        backend: {
            loadPath: 'http://localhost:8010/translations/{{lng}}',
            },
            detection: {
                order: ['path', 'navigator', 'localStorage'],
                lookupFromPathIndex: 0,
            },
            react: {
                useSuspense: true,
            },
    })

export default i18n;