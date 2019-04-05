import { actionTypes } from '../actions';

const initialState = {};

export const formDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.updateFormData:
      const { field, value } = action;
      return {
        ...state,
        [field]: value
      };

    default:
      return state;
  }
};
