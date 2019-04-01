import { actionTypes } from '../actions';

const initialState = {
  offerId: null,
  offerPaymentId: null,
  amount: null,
};

const amountPanelReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.setAmountPanelFormData:
      return action.payload;

    default:
      return state;
  }
};

export default amountPanelReducer;
