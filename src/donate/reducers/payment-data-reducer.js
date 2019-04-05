import { actionTypes } from '../actions';

const initialState = {
  cardNumber: '',
  expiryMonth: '',
  expiryYear: '',
  ccv: '',
};

export const paymentDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.updatePaymentData:
      const { field, value } = action;
      return {
        ...state,
        [field]: value
      };

    default:
      return state;
  }
};
