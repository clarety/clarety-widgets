import jwtDecode from 'jwt-decode';
import { ClaretyApi } from 'clarety-utils';
import { emailStatuses, setCustomer } from 'shared/actions';
import { parseNestedElements } from 'shared/utils';
import { types } from 'checkout/actions';

export const hasAccount = email => {
  return async dispatch => {
    dispatch(hasAccountRequest(email));

    const results = await ClaretyApi.get('carts/customers/has-account/', { email });
    const result = results[0];

    if (result.status === 'error') {
      dispatch(hasAccountFailure(result));
      return emailStatuses.notChecked;
    } else {
      dispatch(hasAccountSuccess(result));
      return result.exists ? emailStatuses.hasAccount : emailStatuses.noAccount;
    }
  };
};

export const fetchCustomer = (uid) => {
  return async dispatch => {
    dispatch(fetchCustomerRequest(uid));

    const results = await ClaretyApi.get(`carts/customers/${uid}/`);
    const result = results[0];

    if (result.status === 'error') {
      dispatch(fetchCustomerFailure(result));
      return false;
    } else {
      dispatch(fetchCustomerSuccess(result));
      dispatch(setCustomer(result));
      return true;
    }
  };
};

export const fetchAuthCustomer = () => {
  return async (dispatch, getState) => {
    const { auth } = getState();
    const jwtData = jwtDecode(auth.jwt);
    return await dispatch(fetchCustomer(jwtData.customer_uid));
  };
};

export const createOrUpdateCustomer = () => {
  return async (dispatch, getState) => {
    const { cart } = getState();

    if (cart.customer && cart.customer.customerUid) {
      return await dispatch(updateCustomer());
    }

    return await dispatch(createCustomer());
  };
};

export const createCustomer = () => {
  return async (dispatch, getState) => {
    const { cart, formData } = getState();
    const { customer } = parseNestedElements(formData);

    dispatch(createCustomerRequest(customer));

    let results = await ClaretyApi.post(`carts/${cart.cartUid}/customers/`, customer);
    const result = results[0];

    if (result.status === 'error') {
      dispatch(createCustomerFailure(result));
      return false;
    } else {
      dispatch(createCustomerSuccess(result));
      return true;
    }
  };
};

export const updateCustomer = () => {
  return async (dispatch, getState) => {
    const { cart, formData } = getState();
    const { customer } = parseNestedElements(formData);

    dispatch(updateCustomerRequest(customer));

    const { customerUid } = cart.customer;
    let results = await ClaretyApi.put(`carts/${cart.cartUid}/customers/${customerUid}/`, customer);
    const result = results[0];

    if (result.status === 'error') {
      dispatch(updateCustomerFailure(result));
      return false;
    } else {
      dispatch(updateCustomerSuccess(result));
      return true;
    }
  };
};


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

// Create Customer

const createCustomerRequest = postData => ({
  type: types.createCustomerRequest,
  postData: postData,
});

const createCustomerSuccess = result => ({
  type: types.createCustomerSuccess,
  result: result,
});

const createCustomerFailure = result => ({
  type: types.createCustomerFailure,
  result: result,
});

// Update Customer

const updateCustomerRequest = putData => ({
  type: types.updateCustomerRequest,
  putData: putData,
});

const updateCustomerSuccess = result => ({
  type: types.updateCustomerSuccess,
  result: result,
});

const updateCustomerFailure = result => ({
  type: types.updateCustomerFailure,
  result: result,
});
