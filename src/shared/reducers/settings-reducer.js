import { types } from 'shared/actions';

export const initialState = {
  createAccountFields: ['email', 'password'],
};

export const settingsReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.updateSettings:
      return {
        ...state,
        ...action.settings,
      };

    case types.fetchSettingsSuccess:
      return {
        ...state,
        ...action.result,
      };

    default:
      return state;
  }
};
