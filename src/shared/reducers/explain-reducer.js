import { actionTypes } from '../actions';

const initialState = {};

export const explainReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.setExplain:
      return action.explain;

    default:
      return state;
  }
};
