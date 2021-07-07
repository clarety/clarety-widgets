import i18next from 'i18next';
import axios from 'axios';

export const t = (...args) => i18next.t(...args);

export const getLanguage = () => i18next.language;

export async function initTranslations({ translationsPath, defaultLanguage, fallbackLanguage = 'en', debug = false }) {
  const language = defaultLanguage || navigator.language || navigator.userLanguage || fallbackLanguage;

  if (!Array.isArray(translationsPath)) {
    translationsPath = [translationsPath];
  }

  i18next.use(CustomBackend);

  await i18next.init({
    lng: language,
    fallbackLng: defaultLanguage || fallbackLanguage,
    returnNull: false,
    keySeparator: false,
    backend: {
      loadPaths: translationsPath,
    },
    debug: debug,
  });

  return t;
}

class CustomBackend {
  static type = 'backend';
  services = null;
  options = null;

  init(services, backendOptions, i18nextOptions) {
    this.services = services;
    this.options = backendOptions;
  }

  async read(language, namespace, callback) {
    const urls = this.options.loadPaths.map(path => {
      return this.services.interpolator.interpolate(path, { lng: language, ns: namespace });
    });

    const requests = urls.map(url => axios.get(url, { validateStatus: () => true }));
    const responses = await Promise.all(requests);

    let translations = {};
    responses.forEach(response => {
      if (response.status === 200 && response.data) {
        translations = {
          ...translations,
          ...response.data,
        };
      }
    });

    callback(null, translations);
  }
}
