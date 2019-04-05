import { actionTypes } from '../actions';

const initialState = null;

export const elementsReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.setElements:
      return action.elements;

    default:
      return state;
  }
};
