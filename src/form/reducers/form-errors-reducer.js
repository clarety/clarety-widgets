import { actionTypes } from '../actions';

const initialState = [];

export const formErrorsReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.setFormErrors:
      return action.errors;

    case actionTypes.clearFormErrors:
      return [];

    default:
      return state;
  }
};
