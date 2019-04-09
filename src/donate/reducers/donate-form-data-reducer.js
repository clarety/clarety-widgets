import { actionTypes } from '../../form/actions';
import { formDataReducer } from '../../form/reducers';

const initialState = {};

export const donateFormDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.updatePaymentData:
      return {
        ...state,
        'payment.stripeToken': undefined,
      };

    default:
      return formDataReducer(state, action);
  }
};
