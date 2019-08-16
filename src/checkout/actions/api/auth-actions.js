import jwtDecode from 'jwt-decode';
import { ClaretyApi } from 'clarety-utils';
import { types, nextPanel } from 'checkout/actions';

const clientId = '82ee4a2479780256c9bf9b951f5d1cfb';

export const emailStatuses = {
  notChecked: 'NOT_CHECKED',
  noAccount:  'NO_ACCOUNT',
  hasAccount: 'HAS_ACCOUNT',
};

export const login = (email, password) => {
  return async dispatch => {
    let result;

    // Login.
    dispatch(loginRequest(email, password));
    result = await ClaretyApi.auth(email, password, clientId);

    if (result.error) {
      dispatch(loginFailure(result));
      return;
    } else {
      dispatch(loginSuccess(result));
    }

    const jwt = jwtDecode(result.access_token);

    // Fetch customer.
    dispatch(fetchCustomerRequest());
    const results = await ClaretyApi.get(`carts/customers/${jwt.customerUid}/`);
    result = results[0];

    if (result.status === 'error') {
      dispatch(fetchCustomerFailure(result));
      return;
    } else {
      dispatch(fetchCustomerSuccess(result));

      // Proceed to the customer details panel.
      dispatch(nextPanel());
    }
  }
};

export const logout = () => ({
  // TODO: do we need to logout via the API?
  type: types.logout,
});

export const hasAccount = email => {
  return async dispatch => {
    dispatch(hasAccountRequest(email));

    const results = await ClaretyApi.get('/carts/has-account/', { email });
    const result = results[0];

    if (result.status === 'error') {
      dispatch(hasAccountFailure(result));
    } else {
      dispatch(hasAccountSuccess(result));
    }
  };
};

export const createAccount = (firstName, lastName, email, password) => {
  return async dispatch => {
    const postData = { firstName, lastName, email, password };

    dispatch(createAccountRequest(postData));
    const result = await ClaretyApi.post('customer-new/', postData);

    if (result.status === 'error') {
      dispatch(createAccountFailure(result));
      return;
    } else {
      dispatch(createAccountSuccess(result));
      // We've created an account, now login.
      dispatch(login(email, password));
    }
  };
};

export const resetEmailStatus = () => ({
  type: types.resetEmailStatus,
});


// Login

const loginRequest = (email, password) => ({
  type: types.loginRequest,
  email: email,
  password: password,
});

const loginSuccess = result => ({
  type: types.loginSuccess,
  result: result,
});

const loginFailure = result => ({
  type: types.loginFailure,
  result: result,
});

// Customer Search

const hasAccountRequest = email => ({
  type: types.hasAccountRequest,
  email: email,
});

const hasAccountSuccess = result => ({
  type: types.hasAccountSuccess,
  result: result,
});

const hasAccountFailure = result => ({
  type: types.hasAccountFailure,
  result: result,
});

// Fetch Customer

const fetchCustomerRequest = () => ({
  type: types.fetchCustomerRequest,
});

const fetchCustomerSuccess = result => ({
  type: types.fetchCustomerSuccess,
  result: result,
});

const fetchCustomerFailure = result => ({
  type: types.fetchCustomerFailure,
  result: result,
});

// Create Account

const createAccountRequest = (postData) => ({
  type: types.createAccountRequest,
  postData: postData,
});

const createAccountSuccess = result => ({
  type: types.createAccountSuccess,
  result: result,
});

const createAccountFailure = result => ({
  type: types.createAccountFailure,
  result: result,
});
