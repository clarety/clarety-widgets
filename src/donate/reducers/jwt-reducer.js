import { types } from 'donate/actions';

const initialState = null;

export const jwtReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.setJwt:
      return action.jwt;

    default:
      return state;
  }
};
