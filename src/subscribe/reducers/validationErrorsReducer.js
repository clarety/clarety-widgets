import actionTypes from '../actions/types';

const initialState = [];

const validationErrorsReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.setValidationErrors:
      return action.payload;

    case actionTypes.clearValidationErrors:
      return [];

    default:
      return state;
  }
};

export default validationErrorsReducer;
