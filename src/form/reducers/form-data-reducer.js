import { types } from 'form/actions';

const initialState = {};

export const formDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.updateFormData:
      const { field, value } = action;
      return {
        ...state,
        [field]: value
      };

    default:
      return state;
  }
};
