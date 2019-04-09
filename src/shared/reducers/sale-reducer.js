import { actionTypes } from '../actions';

const initialState = {
  saleLines: [],
  payment: {},
};

export const saleReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.addSaleLine:
      return {
        ...state,
        saleLines: [
          ...state.saleLines,
          action.saleLine,
        ],
      };

    case actionTypes.clearSaleLines:
      return {
        ...state,
        saleLines: [],
      };

    default:
      return state;
  }
};
