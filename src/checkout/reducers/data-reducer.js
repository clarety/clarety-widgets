import { types } from 'checkout/actions';

const initialState = {
  formData: {},
  paymentData: {},
};

export const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.updateFormData:
      return {
        ...state,
        formData: {
          ...state.formData,
          ...action.formData,
        }
      };

    case types.updatePaymentData:
        return {
          ...state,
          paymentData: {
            ...state.paymentData,
            ...action.paymentData,
          }
        };

    default:
      return state;
  }
};
