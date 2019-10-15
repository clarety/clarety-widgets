import { ClaretyApi } from 'clarety-utils';
import { setStatus, login } from 'shared/actions';
import { parseNestedElements } from 'shared/utils';
import { types } from 'registrations/actions';

export const createAcountAndLogin = () => {
  return async (dispatch, getState) => {
    

    const didCreate = await dispatch(createAccount());
    if (!didCreate) return false;

    const { formData } = getState();
    const { customer } = parseNestedElements(formData);

    const didLogin = await dispatch(login(customer.email, customer.password));
    if (!didLogin) return false;

    const didFetch = await dispatch(fetchAuthCustomer());

    
    return didFetch;
  };
};

export const createAccount = () => {
  return async (dispatch, getState) => {
    const { formData } = getState();
    const { customer } = parseNestedElements(formData);
    
    dispatch(createAccountRequest(customer));

    dispatch(setStatus('busy'));

    let results = await ClaretyApi.post('customer-new/', customer);
    const result = results[0];

    dispatch(setStatus('ready'));

    if (result.status === 'error') {
      dispatch(createAccountFailure(result));
      return false;
    } else {
      dispatch(createAccountSuccess(result));
      return true;
    }
  };
};

export const fetchAuthCustomer = () => {
  return async (dispatch, getState) => {
    dispatch(fetchAuthCustomerRequest());

    dispatch(setStatus('busy'));

    let results = await ClaretyApi.get('registration-customer/');
    const result = results[0];

    dispatch(setStatus('ready'));

    if (result.status === 'error') {
      dispatch(fetchAuthCustomerFailure(result));
      return false;
    } else {
      dispatch(fetchAuthCustomerSuccess(result));
      return true;
    }
  };
};

// Create Account

const createAccountRequest = postData => ({
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

// Fetch Auth Customer

const fetchAuthCustomerRequest = postData => ({
  type: types.fetchAuthCustomerRequest,
  postData: postData,
});

const fetchAuthCustomerSuccess = result => ({
  type: types.fetchAuthCustomerSuccess,
  result: result,
});

const fetchAuthCustomerFailure = result => ({
  type: types.fetchAuthCustomerFailure,
  result: result,
});
