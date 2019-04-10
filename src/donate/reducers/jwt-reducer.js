import { actionTypes } from '../actions';

const initialState = null;

export const jwtReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.setJwt:
      return action.jwt;

    default:
      return state;
  }
};
