import { types, statuses } from 'shared/actions';
import { types as checkoutTypes } from 'checkout/actions/types';
import { types as regoTypes } from 'registrations/actions/types';

const initialState = statuses.initializing;

export const statusReducer = (state = initialState, action) => {
  switch (action.type) {
    // Shared

    case types.setStatus:
      return action.status;

    case types.loginRequest:
      return statuses.busy;

    case types.loginSuccess:
    case types.loginFailure:
      return statuses.ready;

    // Checkout

    case checkoutTypes.hasAccountRequest:
    case checkoutTypes.fetchCustomerRequest:
    case checkoutTypes.fetchCartRequest:
    case checkoutTypes.createCustomerRequest:
    case checkoutTypes.updateCustomerRequest:
    case checkoutTypes.fetchShippingOptionsRequest:
    case checkoutTypes.updateSaleRequest:
    case checkoutTypes.fetchPaymentMethodsRequest:
    case checkoutTypes.makePaymentRequest:
    case checkoutTypes.stripeTokenRequest:
      return statuses.busy;

    case checkoutTypes.applyPromoCodeRequest:
      return statuses.busyPromoCode;

    case checkoutTypes.hasAccountSuccess:
    case checkoutTypes.hasAccountFailure:
    case checkoutTypes.fetchCustomerSuccess:
    case checkoutTypes.fetchCustomerFailure:
    case checkoutTypes.fetchCartSuccess:
    case checkoutTypes.createCustomerSuccess:
    case checkoutTypes.updateCustomerSuccess:
    case checkoutTypes.updateSaleSuccess:
    case checkoutTypes.fetchShippingOptionsSuccess:
    case checkoutTypes.fetchPaymentMethodsSuccess:
    case checkoutTypes.createCustomerFailure:
    case checkoutTypes.updateCustomerFailure:
    case checkoutTypes.makePaymentFailure:
    case checkoutTypes.stripeTokenFailure:
    case checkoutTypes.applyPromoCodeSuccess:
    case checkoutTypes.applyPromoCodeFailure:
      return statuses.ready;

    // Registrations

    case regoTypes.fetchEventsRequest:
      return statuses.initializing;

    case regoTypes.fetchEventsSuccess:
      return statuses.ready;

    case regoTypes.registrationCreateRequest:
      return statuses.validating;

    case regoTypes.registrationCreateSuccess:
    case regoTypes.registrationCreateFailure:
      return statuses.ready;

    case regoTypes.registrationFetchSuccess:
      return statuses.ready;

    case regoTypes.registrationSubmitRequest:
      return statuses.submitting;

    case regoTypes.registrationSubmitFailure:
      return statuses.ready;

    // Default

    default:
      return state;
  }
};
