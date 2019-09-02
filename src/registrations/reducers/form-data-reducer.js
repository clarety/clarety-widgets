import { types } from 'checkout/actions';

const initialState = {};

export const formDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.updateFormData:
      return {
        ...state,
        ...action.formData,
      };

    case types.resetFormData:
      return {};

    default:
      return state;
  }
};
