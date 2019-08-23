import { types } from 'checkout/actions';

const initialState = [];

export const errorsReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.hasAccountRequest:
    case types.loginRequest:
    case types.fetchCustomerRequest:
      return [];
    
    case types.hasAccountFailure:
    case types.loginFailure:
    case types.fetchCustomerFailure:
      return action.result.validationErrors;
    
    default:
      return state;
  }
};
