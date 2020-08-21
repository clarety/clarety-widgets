import i18next from 'i18next';

export const t = (...args) => i18next.t(...args);

export const getLanguage = () => i18next.language;
