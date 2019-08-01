import { types } from 'checkout/actions';

const initialState = {};

export const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.fetchCartSuccess:
    case types.updateCheckoutSuccess:
      return action.result.cart;

    default:
      return state;
  }
};
