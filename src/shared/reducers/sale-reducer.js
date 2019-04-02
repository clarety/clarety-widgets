import { actionTypes } from '../actions';

const initialState = {
  saleLines: [],
  total: 0,
};

const saleReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.addToSale:
      const saleLine = action.payload;

      const saleLines = [
        ...state.saleLines,
        saleLine,
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

export default saleReducer;
