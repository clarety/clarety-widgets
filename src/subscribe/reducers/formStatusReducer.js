import actionTypes from '../actions/types';
import { formStatuses } from '../actions/formStatusActions';

const initialState = formStatuses.uninitialized;

const formStatusReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.setFormStatus:
      return action.payload;

    default:
      return state;
  }
};

export default formStatusReducer;
