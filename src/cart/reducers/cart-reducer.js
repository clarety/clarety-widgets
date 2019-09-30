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
      
    case types.updateItemRequest:
      return {
        ...state,
        isBusy: true,
        errors: [],
      };

    case types.fetchItemsSuccess:
    case types.updateItemSuccess:
      return {
        ...state,
        isBusy: false,
        cart: {
          ...state.cart,
          ...action.result,
        },
      };

    case types.updateItemFailure:
      return {
        ...state,
        isBusy: false,
        errors: action.result.validationErrors,
      };

    default:
      return state;
  }
};
