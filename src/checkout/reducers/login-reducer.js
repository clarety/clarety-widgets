import { types, emailStatuses } from 'checkout/actions';

const initialState = {
  jwt: null,
  customer: null,
  errors: null,
};

export const loginReducer = (state = initialState, action) => {
  switch (action.type) {
    // Login

    case types.loginRequest:
      return {
        ...state,
        errors: null,
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
        emailStatus: emailStatuses.notChecked,
      };

    // Fetch Customer

    case types.fetchCustomerRequest:
      return {
        ...state,
        errors: null,
        customer: null,
      };

    case types.fetchCustomerSuccess:
      return {
        ...state,
        customer: action.result,
      };

    // Failure

    case types.loginFailure:
    case types.fetchCustomerFailure:
      return {
        ...state,
        errors: action.result.validationErrors,
      };

    default:
      return state;
  }
};
