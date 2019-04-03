import { actionTypes } from '../actions';

const initialState = {};

export const paymentPanelReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.updatePaymentPanelData:
      const { field, value } = action.payload;
      return {
        ...state,
        [field]: value
      };

    default:
      return state;
  }
};
