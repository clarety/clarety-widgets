import { types } from '../actions';

const initialState = [];

export const errorsReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.setErrors:
      return action.errors;

    case types.clearErrors:
      return [];

    default:
      return state;
  }
};
