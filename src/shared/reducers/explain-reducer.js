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

    default:
      return state;
  }
};
