import jwtDecode from 'jwt-decode';
import { ClaretyApi } from 'clarety-utils';
import { types, nextPanel, updateCustomerFormData } from 'checkout/actions';

const clientId = '82ee4a2479780256c9bf9b951f5d1cfb';

export const emailStatuses = {
  notChecked: 'not-checked',
  noAccount:  'no-account',
  hasAccount: 'has-account',
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
      dispatch(updateCustomerFormData(result));

      // Proceed to the customer details panel.
      dispatch(nextPanel());
    }
  }
};

export const logout = () => ({
  // TODO: do we need to logout via the API?
  type: types.logout,
});

export const checkForAccount = email => {
  return async dispatch => {
    dispatch(checkForAccountRequest(email));

    const results = await ClaretyApi.get('/carts/has-account/', { email });
    const result = results[0];

    if (result.status === 'error') {
      dispatch(checkForAccountFailure(result));
    } else {
      dispatch(checkForAccountSuccess(result));
    }
  };
};


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

const checkForAccountRequest = email => ({
  type: types.checkForAccountRequest,
  email: email,
});

const checkForAccountSuccess = result => ({
  type: types.checkForAccountSuccess,
  result: result,
});

const checkForAccountFailure = result => ({
  type: types.checkForAccountFailure,
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
