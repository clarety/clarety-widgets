import { types } from 'shared/actions';
import { types as formActionTypes } from 'form/actions';

const initialState = {
  salelines: [],
  payment: {},
};

export const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.addSaleline:
      return {
        ...state,
        salelines: [
          ...state.salelines,
          action.saleline,
        ],
      };

    case types.clearSalelines:
      return {
        ...state,
        salelines: [],
      };

    case types.setPayment:
      return {
        ...state,
        payment: action.payment,
      };

    case types.clearPayment:
    case formActionTypes.updatePaymentData:
      return {
        ...state,
        payment: {},
      };

    default:
      return state;
  }
};
