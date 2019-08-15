import { types } from 'cart/actions';

const initialState = {
  isBusy: false,
  cart: {},
  errors: [],
  busySalelines: [],
};

export const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.fetchSalelinesRequest:
      return {
        ...state,
        errors: [],
      };
    case types.updateSalelineRequest:
      return {
        ...state,
        busySalelines: [...state.busySalelines, action.item],
        errors: [],
      };

    case types.fetchSalelinesSuccess:
    case types.updateSalelineSuccess:
      return {
        ...state,
        isBusy: false,
        cart: action.result.cart,
        busySalelines: []
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
