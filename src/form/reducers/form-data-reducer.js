import { actionTypes } from '../actions';

const initialState = {};

const formDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.updateFormData:
      const { field, value } = action.payload;
      return { ...state, [field]: value };

    default:
      return state;
  }
};

export default formDataReducer;
