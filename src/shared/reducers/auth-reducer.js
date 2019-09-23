import { types } from 'shared/actions';

const initialState = {
  jwt: null,
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.loginSuccess:
      return {
        ...state,
        jwt: action.result.access_token,
      };

    case types.logoutSuccess:
      return {
        ...state,
        jwt: null,
      };

    default:
      return state;
  }
};
