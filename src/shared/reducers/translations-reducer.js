import { types } from 'shared/actions';

const initialState = {
  selectedLanguage: null,
  languages: {},
};

export const translationsReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.setLanguages:
      return {
        ...state,
        languages: action.languages,
      };

    case types.changeLanguage:
      return {
        ...state,
        selectedLanguage: action.languageCode,
      };

    default:
      return state;
  }
};
