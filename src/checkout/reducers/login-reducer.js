import { types } from 'checkout/actions';

const initialState = {
  jwt: null,
  customer: null,
};

export const loginReducer = (state = initialState, action) => {
  switch (action.type) {
    // Login

    case types.loginRequest:
      return {
        ...state,
        jwt: null,
      };

    case types.loginSuccess:
      return {
        ...state,
        jwt: action.result,
      };

    // Logout

    case types.logout:
      return {
        ...state,
        jwt: null,
        customer: null,
      };

    // Fetch Customer

    case types.fetchCustomerRequest:
      return {
        ...state,
        customer: null,
      };

    case types.fetchCustomerSuccess:
      return {
        ...state,
        customer: action.result,
      };

    default:
      return state;
  }
};
