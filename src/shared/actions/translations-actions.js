import i18next from 'i18next';
import { types } from 'shared/actions/types';

export const setLanguages = (languages) => ({
  type: types.setLanguages,
  languages: languages,
});

export const changeLanguage = (languageCode) => {
  return async (dispatch, getState) => {
    i18next.changeLanguage(languageCode);
    dispatch({ type: types.changeLanguage, languageCode });
  };
};
