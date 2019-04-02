import { actionTypes } from '../actions';

const initialState = [];

const formErrorsReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.setFormErrors:
      return action.payload;

    case actionTypes.clearFormErrors:
      return [];

    default:
      return state;
  }
};

export default formErrorsReducer;
