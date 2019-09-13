import { types } from 'shared/actions';

const initialState = {};

export const explainReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.explainFetchSuccess:
      return {
        ...state,
        ...action.explain,
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
