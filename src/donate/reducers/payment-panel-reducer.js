import { actionTypes } from '../actions';

const initialState = {
  cardNumber: '',
  expiryMonth: '',
  expiryYear: '',
  ccv: '',
};

export const paymentPanelReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.updatePaymentPanelData:
      const { field, value } = action;
      return {
        ...state,
        [field]: value
      };

    default:
      return state;
  }
};
