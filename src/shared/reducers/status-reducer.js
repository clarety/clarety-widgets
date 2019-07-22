import { types, statuses } from 'shared/actions';

const initialState = statuses.uninitialized;

export const statusReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.setStatus:
      return action.status;

    default:
      return state;
  }
};
