import { types } from 'checkout/actions';

const initialState = {
  jwt: null,
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.loginRequest:
      return {
        ...state,
        jwt: null,
      };

    case types.loginSuccess:
      return {
        ...state,
        jwt: action.result.access_token,
      };

    case types.logout:
      return {
        ...state,
        jwt: null,
      };

    default:
      return state;
  }
};
