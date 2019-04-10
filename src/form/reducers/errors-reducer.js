import { actionTypes } from '../actions';

const initialState = [];

export const errorsReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.setErrors:
      return action.errors;

    case actionTypes.clearErrors:
      return [];

    default:
      return state;
  }
};
