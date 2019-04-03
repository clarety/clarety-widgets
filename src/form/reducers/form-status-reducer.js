import { actionTypes, statuses } from '../actions';

const initialState = statuses.uninitialized;

export const formStatusReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.setFormStatus:
      return action.payload;

    default:
      return state;
  }
};
