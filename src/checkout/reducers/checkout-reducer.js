import { types } from 'checkout/actions';

const initialState = {
  isBusy: false,
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
        errors: [],
      };

    case types.fetchCartSuccess:
    case types.updateCheckoutSuccess:
      return {
        ...state,
        isBusy: false,
        cart: action.result.cart,
      };

    case types.updateCheckoutFailure:
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

    default:
      return state;
  }
};
