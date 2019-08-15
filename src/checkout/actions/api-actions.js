import { ClaretyApi, Config } from 'clarety-utils';
import { parseNestedElements } from 'shared/utils';
import { createStripeToken, parseStripeError } from 'donate/utils';
import { types, nextPanel, updateFormData } from '.';

const clientId = '82ee4a2479780256c9bf9b951f5d1cfb';

export const gateways = {
  clarety: 'clarety',
  stripe:  'stripe',
};

export const emailStatuses = {
  notChecked: 'NOT_CHECKED',
  noAccount:  'NO_ACCOUNT',
  hasAccount: 'HAS_ACCOUNT',
};

export const fetchCart = () => {
  return async dispatch => {
    // TODO: decode JWT and get cart uid.
    const cartUid = '8c2756b2-f018-4c27-a025-c31fca7e482b';

    dispatch(fetchCartRequest(cartUid));

    const results = await ClaretyApi.get(`carts/${cartUid}/`);
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

    // TODO: where does customer uid come from? Decode JWT?
    const customerUid = 'e7fb8831-4a83-468e-8eec-593185909f18';

    // Fetch customer.
    dispatch(fetchCustomerRequest());
    const results = await ClaretyApi.get(`carts/customers/${customerUid}/`);
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

export const updateCheckout = ({ isDiscountCode = false, shouldAdvance = true } = {}) => {
  return async (dispatch, getState) => {
    const { formData } = getState();

    const postData = parseNestedElements(formData);

    dispatch(updateCheckoutRequest(postData, isDiscountCode));

    const results = await ClaretyApi.post('checkout/', postData);
    const result = results[0];

    if (result.status === 'error') {
      dispatch(updateCheckoutFailure(result));
    } else {
      if (result.status === 'complete') {
        window.location.href = result.redirect;
      } else {
        dispatch(updateCheckoutSuccess(result));
        if (shouldAdvance) dispatch(nextPanel());
      }      
    }
  };
};

export const onSubmitShippingDetails = () => {
  return async (dispatch, getState) => {
    const { checkout, login } = getState();

    if (login.customer || checkout.cart.customer) {
      // TODO: can I use this endpoint without being logged in?
      await updateCustomer(dispatch, getState);
    } else {
      await createCustomer(dispatch, getState);
    }

    await fetchShippingOptions(dispatch, getState);

    // Proceed to shipping options panel.
    dispatch(nextPanel());
  };
};

const createCustomer = async (dispatch, getState) => {
  const { checkout, formData } = getState();
  const { cart } = checkout;

  const postData = parseNestedElements(formData);

  dispatch(createCustomerRequest(postData));

  let results = await ClaretyApi.post(`carts/${cart.uid}/customers/`, postData);
  const result = results[0];

  if (result.status === 'error') {
    dispatch(createCustomerFailure(result));
  } else {
    dispatch(createCustomerSuccess(result));
  }
};

const updateCustomer = async (dispatch, getState) => {
  const { checkout, login, formData } = getState();
  const { cart } = checkout;
  const customer = login.customer || cart.customer;

  const putData = parseNestedElements(formData);

  dispatch(updateCustomerRequest(putData));

  let results = await ClaretyApi.put(`carts/${cart.uid}/customers/${customer.uid}/`, putData);
  const result = results[0];

  if (result.status === 'error') {
    dispatch(updateCustomerFailure(result));
  } else {
    dispatch(updateCustomerSuccess(result));
  }
};

const fetchShippingOptions = async (dispatch, getState) => {
  const { checkout } = getState();
  const { cart } = checkout;

  dispatch(fetchShippingOptionsRequest(cart.uid));

  const results = await ClaretyApi.get(`carts/${cart.uid}/shipping-options/`);

  if (!results) {
    dispatch(fetchShippingOptionsFailure());
  } else {
    dispatch(fetchShippingOptionsSuccess(results));
  }
};

export const makePayment = paymentData => {
  const gateway = Config.get('gateway');

  switch (gateway) {
    case gateways.stripe: return makeStripePayment(paymentData);
    default:              return makeClaretyPayment(paymentData);
  }
};

const makeClaretyPayment = paymentData => {
  return async dispatch => {
    const formData = {
      'payment.cardNumber':       paymentData.cardNumber,
      'payment.cardName':         paymentData.cardName,
      'payment.cardExpiryMonth':  paymentData.expiryMonth,
      'payment.cardExpiryYear':   paymentData.expiryYear,
      'payment.cardSecurityCode': paymentData.ccv,
    };

    dispatch(updateFormData(formData));
    dispatch(updateCheckout());
  };
};

const makeStripePayment = paymentData => {
  return async dispatch => {
    // TODO: get stripe key from init...
    const stripeKey = 'pk_test_5AVvhyJrg3yIEnWSMQVBl3mQ00mK2D2SOD';
    const stripeData = {
      cardNumber:  paymentData.cardNumber,
      expiryMonth: paymentData.expiryMonth,
      expiryYear:  paymentData.expiryYear,
      ccv:         paymentData.ccv,
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


// Update Checkout

const updateCheckoutRequest = (postData, isDiscountCode) => ({
  type: types.updateCheckoutRequest,
  postData: postData,
  isDiscountCode: isDiscountCode,
});

const updateCheckoutSuccess = result => ({
  type: types.updateCheckoutSuccess,
  result: result,
});

const updateCheckoutFailure = result => ({
  type: types.updateCheckoutFailure,
  result: result,
});


// Fetch Shipping Options

const fetchShippingOptionsRequest = cardUid => ({
  type: types.fetchShippingOptionsRequest,
  cardUid: cardUid,
});

const fetchShippingOptionsSuccess = results => ({
  type: types.fetchShippingOptionsSuccess,
  results: results,
});

const fetchShippingOptionsFailure = () => ({
  type: types.fetchShippingOptionsFailure,
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
