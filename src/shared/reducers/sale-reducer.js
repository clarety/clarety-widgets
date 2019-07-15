import { actionTypes } from '../actions';
import { types as formActionTypes } from '../../form/actions';

const initialState = {
  salelines: [],
  payment: {},
};

export const saleReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.addSaleline:
      return {
        ...state,
        salelines: [
          ...state.salelines,
          action.saleline,
        ],
      };

    case actionTypes.clearSalelines:
      return {
        ...state,
        salelines: [],
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
