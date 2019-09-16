import { types } from 'registrations/actions';

const initialState = {
  uid: null,
  jwt: null,
  sale: null,
  errors: [],
};

export const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.registrationCreateSuccess:
      return {
        errors: [],
        uid: action.result.uid,
        jwt: action.result.jwt,
        sale: action.result.sale,
      };

    case types.registrationCreateFailure:
      return {
        ...state,
        errors: action.result.validationErrors,
      };

    default:
      return state;
  }
};
