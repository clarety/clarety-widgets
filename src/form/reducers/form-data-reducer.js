import { types } from 'form/actions';

const initialState = {};

export const formDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.setFormData:
      return {
        ...state,
        ...action.formData,
      };

    case types.updateFormData:
      return {
        ...state,
        [action.field]: action.value,
      };

    case types.resetFormData:
      return {};

    default:
      return state;
  }
};
