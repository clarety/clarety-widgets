import { types as sharedTypes } from 'shared/actions';
import { statuses, types } from 'checkout/actions';

const initialState = statuses.ready;

export const statusReducer = (state = initialState, action) => {
  switch (action.type) {
    case sharedTypes.loginRequest:
    case types.hasAccountRequest:
    case types.fetchCustomerRequest:
    case types.fetchCartRequest:
    case types.createCustomerRequest:
    case types.updateCustomerRequest:
    case types.fetchShippingOptionsRequest:
    case types.updateSaleRequest:
    case types.fetchPaymentMethodsRequest:
    case types.makePaymentRequest:
    case types.stripeTokenRequest:
      return statuses.busy;

    case types.applyPromoCodeRequest:
      return statuses.busyPromoCode;

    case sharedTypes.loginSuccess:
    case sharedTypes.loginFailure:
    case types.hasAccountSuccess:
    case types.hasAccountFailure:
    case types.fetchCustomerSuccess:
    case types.fetchCustomerFailure:
    case types.fetchCartSuccess:
    case types.createCustomerSuccess:
    case types.updateCustomerSuccess:
    case types.updateSaleSuccess:
    case types.fetchShippingOptionsSuccess:
    case types.fetchPaymentMethodsSuccess:
    case types.createCustomerFailure:
    case types.updateCustomerFailure:
    case types.makePaymentFailure:
    case types.stripeTokenFailure:
    case types.applyPromoCodeSuccess:
    case types.applyPromoCodeFailure:
      return statuses.ready;

    default:
      return state;
  }
};
