import { types } from 'registrations/actions';

const initialState = {
  uid: null,
  jwt: null,
  sale: null,
};

export const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.registrationCreateSuccess:
      return {
        uid: action.result.uid,
        jwt: action.result.jwt,
        sale: action.result.sale,
      };

    default:
      return state;
  }
};
