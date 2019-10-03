import { types } from 'shared/actions';

export const initialState = {};

export const settingsReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.fetchSettingsSuccess:
      return {
        ...state,
        ...action.result,
      };

    case types.setVariant:
      return {
        ...state,
        variant: action.variant,
      };

    case types.setConfirmPageUrl:
      return {
        ...state,
        confirmPageUrl: action.confirmPageUrl,
      };

    default:
      return state;
  }
};
