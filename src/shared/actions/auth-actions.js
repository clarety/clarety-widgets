import { ClaretyApi } from 'clarety-utils';
import { types } from 'shared/actions';
import { getClientId } from 'shared/selectors';

export const setAuth = (jwt) => ({
  type: types.setAuth,
  jwt: jwt,
});

export const login = (email, password) => {
  return async (dispatch, getState) => {
    const state = getState();
    const clientId = getClientId(state);

    // Login.
    dispatch(loginRequest(email, password));
    let result = await ClaretyApi.auth(email, password, clientId);

    if (result.error) {
      dispatch(loginFailure(result));
      return false;
    } else {
      dispatch(loginSuccess(result));
      return true;
    }
  }
};

export const logout = () => {
  return dispatch => {
    dispatch(logoutRequest());
    dispatch(logoutSuccess());
  };
};


// Login

const loginRequest = (email, password) => ({
  type: types.loginRequest,
  email: email,
  password: password,
});

const loginSuccess = (result) => ({
  type: types.loginSuccess,
  result: result,
});

const loginFailure = (result) => ({
  type: types.loginFailure,
  result: result,
});

// Logout

const logoutRequest = () => ({
  type: types.logoutRequest,
});

const logoutSuccess = (result) => ({
type: types.logoutSuccess,
  result: result,
});

const logoutFailure = (result) => ({
  type: types.logoutFailure,
  result: result,
});