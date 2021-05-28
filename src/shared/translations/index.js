import i18next from 'i18next';
import i18nextHttpBackend from 'i18next-http-backend';

export const t = (...args) => i18next.t(...args);

export const getLanguage = () => i18next.language;

export async function initTranslations({ translationsPath, defaultLanguage, fallbackLanguage = 'en', debug = false }) {
  const language = defaultLanguage || navigator.language || navigator.userLanguage || fallbackLanguage;

  i18next.use(i18nextHttpBackend);

  await i18next.init({
    load: 'languageOnly',
    lng: language,
    fallbackLng: defaultLanguage || fallbackLanguage,
    returnNull: false,
    keySeparator: false,
    backend: {
      loadPath: translationsPath,
    },
    debug: debug,
  });

  return t;
}
