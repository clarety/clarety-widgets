import { types } from 'checkout/actions';

const initialState = {
  isBusy: false,
  isBusyPromoCode: false,
  cart: {},
  shippingOptions: [],
  paymentMethods: [],
  errors: [],
};

export const checkoutReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.fetchCartRequest:
    case types.createCustomerRequest:
    case types.updateCustomerRequest:
    case types.fetchShippingOptionsRequest:
    case types.selectShippingRequest:
    case types.fetchPaymentMethodsRequest:
    case types.updateCheckoutRequest:
    case types.stripeTokenRequest:
      return {
        ...state,
        isBusy: true,
        errors: [],
      };

    case types.applyPromoCodeRequest:
      return {
        ...state,
        isBusyPromoCode: true,
        errors: [],
      };

    case types.fetchCartSuccess:
    case types.createCustomerSuccess:
    case types.updateCustomerSuccess:
    case types.selectShippingSuccess:
    case types.updateCheckoutSuccess:
    case types.applyDiscountCodeSuccess:
      return {
        ...state,
        isBusy: false,
        cart: action.result,
      };

    case types.applyPromoCodeSuccess:
      return {
        ...state,
        isBusyPromoCode: false,
        cart: action.result,
      };

    case types.fetchShippingOptionsSuccess:
      return {
        ...state,
        isBusy: false,
        shippingOptions: action.results,
      };

    case types.fetchPaymentMethodsSuccess:
      return {
        ...state,
        isBusy: false,
        PaymentMethods: action.results,
      };

    case types.updateCheckoutFailure:
      return {
        ...state,
        isBusy: false,
        isBusyPromoCode: false,
        errors: action.result.validationErrors,
      };

    case types.stripeTokenFailure:
      return {
        ...state,
        isBusy: false,
        errors: action.errors,
      };

    default:
      return state;
  }
};
