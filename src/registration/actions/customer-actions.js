import { ClaretyApi, Config } from 'clarety-utils';
import { setStatus, login, emailStatuses } from 'shared/actions';
import { parseNestedElements } from 'shared/utils';
import { types } from 'registration/actions';

export const hasAccount = email => {
  return async dispatch => {
    dispatch(hasAccountRequest(email));

    const results = await ClaretyApi.get('customer-search/', { email });
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
    const state = getState();

    dispatch(fetchAuthCustomerRequest());

    dispatch(setStatus('busy'));

    const { previousSeriesId } = state.settings;
    let results = await ClaretyApi.get('registration-customer/', { previousSeriesId });
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
