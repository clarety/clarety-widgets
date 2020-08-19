import axios from 'axios';
import Cookies from 'js-cookie';
import { ClaretyApi } from 'clarety-utils';
import { types } from 'shared/actions';
import { getClientId } from 'shared/selectors';

export const emailStatuses = {
  notChecked: 'not-checked',
  noAccount:  'no-account',
  hasAccount: 'has-account',
};

export const setAuth = (jwt) => ({
  type: types.setAuth,
  jwt: jwt,
});

export const login = (email, password) => {
  return async (dispatch, getState) => {
    const state = getState();
    const clientId = getClientId(state);

    dispatch(loginRequest(email, password));
    const result = await ClaretyApi.auth(email, password, clientId);

    if (result.error) {
      dispatch(loginFailure(result));
      return false;
    } else {
      dispatch(loginSuccess(result));
      Cookies.set('jwtAccount', result.access_token);
      return true;
    }
  }
};

export const logout = () => {
  return async (dispatch) => {
    dispatch(logoutRequest());

    await axios.post('ajax.php?SiteCustomer/logout', {}, { validateStatus: false });

    Cookies.remove('jwtAccount');
    ClaretyApi.clearAuth();

    dispatch(logoutSuccess());

    return true;
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
