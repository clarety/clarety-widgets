import jwtDecode from 'jwt-decode';
import { ClaretyApi } from 'clarety-utils';
import { types } from 'checkout/actions';

export const emailStatuses = {
  notChecked: 'not-checked',
  noAccount:  'no-account',
  hasAccount: 'has-account',
};

export const hasAccount = email => {
  return async dispatch => {
    dispatch(hasAccountRequest(email));

    const results = await ClaretyApi.get('/carts/has-account/', { email });
    const result = results[0];

    if (result.status === 'error') {
      dispatch(hasAccountFailure(result));
      return false;
    } else {
      dispatch(hasAccountSuccess(result));
      return true;
    }
  };
};

export const fetchCustomer = uid => {
  return async dispatch => {
    dispatch(fetchCustomerRequest(uid));

    const results = await ClaretyApi.get(`carts/customers/${uid}/`);
    const result = results[0];

    if (result.status === 'error') {
      dispatch(fetchCustomerFailure(result));
      return false;
    } else {
      dispatch(fetchCustomerSuccess(result));
      return true;
    }
  };
};

export const fetchAuthCustomer = () => {
  return async (dispatch, getState) => {
    const { auth } = getState();
    const jwtData = jwtDecode(auth.jwt);
    return await dispatch(fetchCustomer(jwtData.customerUid));
  };
};

export const resetEmailStatus = () => ({
  type: types.resetEmailStatus,
});


// Has Account

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

const fetchCustomerRequest = uid => ({
  type: types.fetchCustomerRequest,
  uid: uid,
});

const fetchCustomerSuccess = result => ({
  type: types.fetchCustomerSuccess,
  result: result,
});

const fetchCustomerFailure = result => ({
  type: types.fetchCustomerFailure,
  result: result,
});
