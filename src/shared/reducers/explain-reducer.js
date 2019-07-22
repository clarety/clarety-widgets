import { types } from 'shared/actions';

const initialState = {};

export const explainReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.explainFetchSuccess:
      return action.explain;

    default:
      return state;
  }
};
