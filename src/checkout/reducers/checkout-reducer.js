import { types } from 'checkout/actions';

const initialState = {
  isBusy: false,
  isBusyDiscountCode: false,
  cart: {},
  errors: [],
};

export const checkoutReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.fetchCartRequest:
    case types.updateCheckoutRequest:
    case types.stripeTokenRequest:
      return {
        ...state,
        isBusy: true,
        isBusyDiscountCode: action.isDiscountCode || false,
        errors: [],
      };

    case types.fetchCartSuccess:
    case types.updateCheckoutSuccess:
    case types.applyDiscountCodeSuccess:
      return {
        ...state,
        isBusy: false,
        isBusyDiscountCode: false,
        cart: action.result,
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
