import { types } from 'checkout/actions';

const initialState = [];

export const errorsReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.setErrors:
      return action.errors;

    case types.checkForAccountRequest:
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

    case types.stripeTokenFailure:
      return  action.errors;

    case types.loginFailure:
      return [{
        field: 'password',
        message: action.result.error_description,
      }];

    default:
      return state;
  }
};
