import { types } from 'checkout/actions';

const initialState = [];

export const errorsReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.hasAccountRequest:
    case types.loginRequest:
    case types.fetchCustomerRequest:
    case types.fetchCartRequest:
    case types.createCustomerRequest:
    case types.updateCustomerRequest:
    case types.fetchShippingOptionsRequest:
    case types.updateSaleRequest:
    case types.fetchPaymentMethodsRequest:
    case types.makePaymentRequest:
    case types.stripeTokenRequest:
    case types.applyPromoCodeRequest:
      return [];
    
    case types.hasAccountFailure:
    case types.loginFailure:
    case types.fetchCustomerFailure:
    case types.createCustomerFailure:
    case types.updateCustomerFailure:
    case types.makePaymentFailure:
      return action.result.validationErrors;

    case types.stripeTokenFailure:
      return  action.errors;

    default:
      return state;
  }
};
