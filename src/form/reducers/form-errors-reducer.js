import actionTypes from '../actions/types';

const initialState = [];

const formErrorsReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.setFormValidationErrors:
      return action.payload;

    case actionTypes.clearFormValidationErrors:
      return [];

    default:
      return state;
  }
};

export default formErrorsReducer;
