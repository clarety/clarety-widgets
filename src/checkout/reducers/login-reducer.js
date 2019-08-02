import { types, emailStatuses } from 'checkout/actions';

const initialState = {
  isBusy: false,
  emailStatus: emailStatuses.notChecked,
  jwt: null,
  customer: null,
  errors: null,
};

export const loginReducer = (state = initialState, action) => {
  switch (action.type) {
    // Customer Search

    case types.customerSearchRequest:
      return {
        ...state,
        isBusy: true,
        emailStatus: emailStatuses.notChecked,
        errors: null,
      };

    case types.customerSearchSuccess:
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

    case types.customerSearchFailure:
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
