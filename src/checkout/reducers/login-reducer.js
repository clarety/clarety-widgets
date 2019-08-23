import { types, emailStatuses } from 'checkout/actions';

const initialState = {
  isBusy: false,
  jwt: null,
  customer: null,
  errors: null,
};

export const loginReducer = (state = initialState, action) => {
  switch (action.type) {
    // Customer Search

    case types.hasAccountRequest:
      return {
        ...state,
        isBusy: true,
        errors: null,
      };

    case types.hasAccountSuccess:
      return {
        ...state,
        isBusy: false,
        emailStatus: action.result.exists ? emailStatuses.hasAccount : emailStatuses.noAccount,
      };

    // Login

    case types.loginRequest:
      return {
        ...state,
        isBusy: true,
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
        isBusy: true,
        errors: null,
        customer: null,
      };

    case types.fetchCustomerSuccess:
      return {
        ...state,
        isBusy: false,
        customer: action.result,
      };

    // Failure

    case types.hasAccountFailure:
    case types.loginFailure:
    case types.fetchCustomerFailure:
      return {
        ...state,
        isBusy: false,
        errors: action.result.validationErrors,
      };

    default:
      return state;
  }
};
