import { types } from 'checkout/actions';

const initialState = [];

export const errorsReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.setErrors:
      return action.errors;

    case types.registrationCreateRequest:
    case types.registrationSubmitRequest:
      return [];

    default:
      return state;
  }
};
