import { actionTypes } from '../actions';

const initialState = null;

export const elementsReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.setElements:
      return action.payload;

    default:
      return state;
  }
};
