import { setStatus, setCustomer, login, emailStatuses } from 'shared/actions';
import { getCart } from 'shared/selectors';
import { parseNestedElements } from 'shared/utils';
import { types } from 'registration/actions';
import { RegistrationApi } from 'registration/utils';

export const hasAccount = (email) => {
  return async dispatch => {
    dispatch(hasAccountRequest(email));

    const result = await RegistrationApi.hasAccount(email);

    if (result.status === 'error') {
      dispatch(hasAccountFailure(result));
      return emailStatuses.notChecked;
    } else {
      dispatch(hasAccountSuccess(result));
      return result.exists ? emailStatuses.hasAccount : emailStatuses.noAccount;
    }
  };
};

export const resetPassword = (email) => {
  return async dispatch => {
    dispatch(resetPasswordRequest(email));
    dispatch(setStatus('busy-reset-password'));

    const result = await RegistrationApi.resetPassword(email);

    dispatch(setStatus('ready'));

    if (result.errors) {
      dispatch(resetPasswordFailure(result));
      return false;
    } else {
      dispatch(resetPasswordSuccess(result));
      return true;
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

    const result = await RegistrationApi.createAccount(customer);

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

    const { prevSeriesId } = state.settings;
    const result = await RegistrationApi.fetchCustomer(prevSeriesId);

    dispatch(setStatus('ready'));

    if (result.status === 'error') {
      dispatch(fetchAuthCustomerFailure(result));
      return false;
    } else {
      dispatch(fetchAuthCustomerSuccess(result));
      dispatch(setCustomer(result));
      return true;
    }
  };
};

export const updateAuthCustomer = () => {
  return async (dispatch, getState) => {
    const state = getState();
    const cart = getCart(state);

    dispatch(updateAuthCustomerRequest());
    dispatch(setStatus('busy'));

    const result = await RegistrationApi.updateCustomer(cart.customer);

    dispatch(setStatus('ready'));

    if (result.status === 'error') {
      dispatch(updateAuthCustomerFailure(result.validationErrors));
      return false;
    } else {
      dispatch(updateAuthCustomerSuccess(result));
      return true;
    }
  };
};

// Has Account

const hasAccountRequest = (email) => ({
  type: types.hasAccountRequest,
  email: email,
});

const hasAccountSuccess = (result) => ({
  type: types.hasAccountSuccess,
  result: result,
});

const hasAccountFailure = (result) => ({
  type: types.hasAccountFailure,
  result: result,
});

// Reset Password

const resetPasswordRequest = (email) => ({
  type: types.resetPasswordRequest,
  email: email,
});

const resetPasswordSuccess = (result) => ({
  type: types.resetPasswordSuccess,
  result: result,
});

const resetPasswordFailure = (result) => ({
  type: types.resetPasswordFailure,
  result: result,
});

// Create Account

const createAccountRequest = (postData) => ({
  type: types.createAccountRequest,
  postData: postData,
});

const createAccountSuccess = (result) => ({
  type: types.createAccountSuccess,
  result: result,
});

const createAccountFailure = (result) => ({
  type: types.createAccountFailure,
  result: result,
});

// Fetch Auth Customer

const fetchAuthCustomerRequest = (postData) => ({
  type: types.fetchAuthCustomerRequest,
  postData: postData,
});

const fetchAuthCustomerSuccess = (result) => ({
  type: types.fetchAuthCustomerSuccess,
  result: result,
});

const fetchAuthCustomerFailure = (result) => ({
  type: types.fetchAuthCustomerFailure,
  result: result,
});

// Update Auth Customer

const updateAuthCustomerRequest = (customer) => ({
  type: types.updateAuthCustomerRequest,
  customer: customer,
});

const updateAuthCustomerSuccess = (customer) => ({
  type: types.updateAuthCustomerSuccess,
  customer: customer,
});

const updateAuthCustomerFailure = (errors) => ({
  type: types.updateAuthCustomerFailure,
  errors: errors,
});
