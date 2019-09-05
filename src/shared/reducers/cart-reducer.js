import { types } from 'shared/actions';

const initialState = {
  uid: null,
  jwt: null,
  items: [],
  customer: {},
  payment: {},
};

export const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.addItem:
      return {
        ...state,
        items: [
          ...state.items,
          action.item,
        ],
      };

    case types.clearItems:
      return {
        ...state,
        items: [],
      };

    case types.setPayment:
      return {
        ...state,
        payment: action.payment,
      };

    case types.clearPayment:
      return {
        ...state,
        payment: {},
      };

    default:
      return state;
  }
};
