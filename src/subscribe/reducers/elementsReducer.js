import actionTypes from '../actions/types';

const initialState = null;

const elementsReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.setElements:
      return action.payload;

    default:
      return state;
  }
};

export default elementsReducer;
