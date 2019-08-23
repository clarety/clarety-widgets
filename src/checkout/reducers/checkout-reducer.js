import { types } from 'checkout/actions';

const initialState = {
  isBusy: false,
  isBusyPromoCode: false,
  cart: {},
  shippingOptions: [],
  paymentMethods: [],
  errors: [],

  jwt: null,
  customer: null,
};

export const checkoutReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.fetchCartRequest:
    case types.createCustomerRequest:
    case types.updateCustomerRequest:
    case types.fetchShippingOptionsRequest:
    case types.updateSaleRequest:
    case types.fetchPaymentMethodsRequest:
    case types.makePaymentRequest:
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
    case types.updateSaleSuccess:
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
        paymentMethods: action.results,
      };

    case types.createCustomerFailure:
    case types.updateCustomerFailure:
    case types.makePaymentFailure:
      return {
        ...state,
        isBusy: false,
        errors: action.result.validationErrors,
      };

    case types.stripeTokenFailure:
      return {
        ...state,
        isBusy: false,
        errors: action.errors,
      };

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
