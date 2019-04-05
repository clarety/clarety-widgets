import { actionTypes, statuses } from '../actions';

const initialState = statuses.uninitialized;

export const statusReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.setStatus:
      return action.status;

    default:
      return state;
  }
};
