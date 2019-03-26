import actionTypes from '../actions/types';
import { statuses } from '../actions/form-status-actions';

const initialState = statuses.uninitialized;

const formStatusReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.setFormStatus:
      return action.payload;

    default:
      return state;
  }
};

export default formStatusReducer;
