import { types } from 'checkout/actions';

const initialState = {
  isBusy: false,
  isBusyDiscountCode: false,
  cart: {},
  shippingOptions: [],
  errors: [],
};

export const checkoutReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.fetchCartRequest:
    case types.createCustomerRequest:
    case types.updateCustomerRequest:
    case types.fetchShippingOptionsRequest:
    case types.updateCheckoutRequest:
    case types.stripeTokenRequest:
      return {
        ...state,
        isBusy: true,
        isBusyDiscountCode: action.isDiscountCode || false,
        errors: [],
      };

    case types.fetchCartSuccess:
    case types.createCustomerSuccess:
    case types.updateCustomerSuccess:
    case types.updateCheckoutSuccess:
    case types.applyDiscountCodeSuccess:
      return {
        ...state,
        isBusy: false,
        isBusyDiscountCode: false,
        cart: action.result,
      };

    case types.fetchShippingOptionsSuccess:
      return {
        ...state,
        isBusy: false,
        shippingOptions: action.results,
      }; 

    case types.updateCheckoutFailure:
      return {
        ...state,
        isBusy: false,
        isBusyDiscountCode: false,
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
