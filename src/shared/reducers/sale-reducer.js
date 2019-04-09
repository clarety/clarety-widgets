import { actionTypes } from '../actions';
import { actionTypes as formActionTypes } from '../../form/actions';

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

    case actionTypes.setPayment:
      return {
        ...state,
        payment: action.payment,
      };

    case actionTypes.clearPayment:
    case formActionTypes.updatePaymentData:
      return {
        ...state,
        payment: {},
      };

    default:
      return state;
  }
};
