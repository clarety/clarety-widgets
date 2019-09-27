import { types } from 'cart/actions';

const initialState = {
  cart: {},
  errors: [],
};

export const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.fetchItemsRequest:
      return {
        ...state,
        errors: [],
      };
      
    case types.updateItemRequest:
      return {
        ...state,
        errors: [],
      };

    case types.fetchItemsSuccess:
    case types.updateItemSuccess:
      return {
        ...state,
        cart: {
          ...state.cart,
          ...action.result,
        }
      };

    case types.updateItemFailure:
      return {
        ...state,
        errors: action.result.validationErrors,
      };

    default:
      return state;
  }
};
