import { actionTypes } from '../actions';

const initialState = {
  saleLines: [],
  total: 0,
};

export const saleReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.addToSale:
      const saleLines = [
        ...state.saleLines,
        action.saleLine,
      ];

      const total = saleLines.reduce((total, line) => total + line.amount, 0);

      return {
        saleLines,
        total,
      };

    case actionTypes.clearSale:
      return initialState;

    default:
      return state;
  }
};
