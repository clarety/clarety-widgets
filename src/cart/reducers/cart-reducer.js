import { types } from 'cart/actions';

const initialState = {
  isBusy: false,
  cart: {},
  errors: [],
};

export const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.fetchItemsRequest:
      return {
        ...state,
        isBusy: true,
        errors: [],
      };
      
    case types.updateCartItemRequest:
    case types.removeCartItemRequest:
      return {
        ...state,
        isBusy: true,
        errors: [],
      };

    case types.fetchItemsSuccess:
    case types.updateCartItemSuccess:
    case types.removeCartItemSuccess:
      return {
        ...state,
        isBusy: false,
        cart: {
          ...state.cart,
          ...action.result,
        },
      };

    case types.updateCartItemFailure:
    case types.removeCartItemFailure:
      return {
        ...state,
        isBusy: false,
        errors: action.result.validationErrors,
      };

    default:
      return state;
  }
};
