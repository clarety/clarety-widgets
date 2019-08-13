import { types } from 'cart/actions';

const initialState = {
  isBusy: false,
  cart: {},
  errors: [],
};

export const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.fetchSalelinesRequest:
    case types.updateSalelineRequest:
      return {
        ...state,
        isBusy: true,
        errors: [],
      };

    case types.fetchSalelinesSuccess:
    case types.updateSalelineSuccess:
      return {
        ...state,
        isBusy: false,
        cart: action.result.cart,
      };

    case types.updateSalelineFailure:
      return {
        ...state,
        isBusy: false,
        errors: action.result.validationErrors,
      };

    default:
      return state;
  }
};
