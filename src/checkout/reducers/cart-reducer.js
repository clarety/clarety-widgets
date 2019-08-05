import { types } from 'checkout/actions';

const initialState = {
  isBusy: false,
  cart: {},
  errors: null,
};

export const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.fetchCartRequest:
    case types.updateCheckoutRequest:
    case types.stripeTokenRequest:
      return {
        ...state,
        isBusy: true,
        errors: null,
      };

    case types.fetchCartSuccess:
    case types.updateCheckoutSuccess:
      return {
        ...state,
        isBusy: false,
        cart: action.result.cart,
      };

    default:
      return state;
  }
};
