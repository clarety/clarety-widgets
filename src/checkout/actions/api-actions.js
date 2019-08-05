import { ClaretyApi } from 'clarety-utils';
import { createStripeToken, parseStripeError } from 'donate/utils';
import { types, nextPanel, updateFormData } from '.';

const clientId = '82ee4a2479780256c9bf9b951f5d1cfb';

export const emailStatuses = {
  notChecked: 'NOT_CHECKED',
  noAccount:  'NO_ACCOUNT',
  hasAccount: 'HAS_ACCOUNT',
};

export const fetchCart = () => {
  return async dispatch => {
    // TODO: where does cart id come from? cookies?
    const cartId = '123-cart-id';

    dispatch(fetchCartRequest(cartId));

    const results = await ClaretyApi.get('checkout/cart/', cartId);
    const result = results[0];

    if (result.status === 'error') {
      dispatch(fetchCartFailure(result));
    } else {
      dispatch(fetchCartSuccess(result));
    }
  };
};

export const customerSearch = email => {
  return async dispatch => {
    dispatch(customerSearchRequest(email));

    const results = await ClaretyApi.get('customer-search/', { email });
    const result = results[0];

    if (result.status === 'error') {
      dispatch(customerSearchFailure(result));
    } else {
      dispatch(customerSearchSuccess(result));
    }
  };
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

    // Fetch customer.
    dispatch(fetchCustomerRequest());
    // TODO: use shop endpoint, not registration.
    const results = await ClaretyApi.get('registration-customer/');
    result = results[0];

    if (result.status === 'error') {
      dispatch(fetchCustomerFailure(result));
      return;
    } else {
      dispatch(fetchCustomerSuccess(result));

      // We've logged in successfully, proceed to the next panel.
      dispatch(nextPanel());
    }
  }
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

export const updateCheckout = () => {
  return async (dispatch, getState) => {
    const { formData } = getState();

    // TODO: inflate form data...
    const postData = formData;

    dispatch(updateCheckoutRequest(postData));

    const results = await ClaretyApi.post('checkout/', postData);
    const result = results[0];

    if (result.status === 'error') {
      dispatch(updateCheckoutFailure(result));
    } else {
      // TODO: redirect on success.
      dispatch(updateCheckoutSuccess(result));
    }
  };
};

export const makePayment = formData => {
  return async dispatch => {
    const stripeKey = 'pk_test_5AVvhyJrg3yIEnWSMQVBl3mQ00mK2D2SOD'; // TODO: get stripe key from somewhere... maybe the config???
    const stripeData = {
      cardNumber:  formData.cardNumber,
      expiryMonth: formData.expiryMonth,
      expiryYear:  formData.expiryYear,
      ccv:         formData.ccv,
    };

    dispatch(stripeTokenRequest(stripeData, stripeKey));

    const token = await createStripeToken(stripeData, stripeKey);

    if (token.error) {
      const errors = parseStripeError(token.error);
      dispatch(stripeTokenFailure(errors));
    } else {
      dispatch(stripeTokenSuccess(token));
      dispatch(updateFormData({ 'payment.gatewayToken': token.id }));
      dispatch(updateCheckout());
    }
  };
};


// Fetch Cart

const fetchCartRequest = id => ({
  type: types.fetchCartRequest,
  id: id,
});

const fetchCartSuccess = result => ({
  type: types.fetchCartSuccess,
  result: result,
});

const fetchCartFailure = result => ({
  type: types.fetchCartFailure,
  result: result,
});


// Customer Search

const customerSearchRequest = email => ({
  type: types.customerSearchRequest,
  email: email,
});

const customerSearchSuccess = result => ({
  type: types.customerSearchSuccess,
  result: result,
});

const customerSearchFailure = result => ({
  type: types.customerSearchFailure,
  result: result,
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


// Update Checkout

const updateCheckoutRequest = postData => ({
  type: types.updateCheckoutRequest,
  postData: postData,
});

const updateCheckoutSuccess = result => ({
  type: types.updateCheckoutSuccess,
  result: result,
});

const updateCheckoutFailure = result => ({
  type: types.updateCheckoutFailure,
  result: result,
});


// Stripe Token

const stripeTokenRequest = (stripeData, stripeKey) => ({
  type: types.stripeTokenRequest,
  stripeData: stripeData,
  stripeKey: stripeKey,
});

const stripeTokenSuccess = token => ({
  type: types.stripeTokenSuccess,
  token: token,
});

const stripeTokenFailure = errors => ({
  type: types.stripeTokenFailure,
  errors: errors,
});
