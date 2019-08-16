import { ClaretyApi } from 'clarety-utils';
import { parseNestedElements } from 'shared/utils';
import { types, nextPanel } from 'checkout/actions';

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

export const onSubmitShippingDetails = () => {
  return async (dispatch, getState) => {
    const { checkout, login } = getState();

    if (login.customer || checkout.cart.customer) {
      // TODO: can I use this endpoint without being logged in?
      await _updateCustomer(dispatch, getState);
    } else {
      await _createCustomer(dispatch, getState);
    }

    await _fetchShippingOptions(dispatch, getState);

    // Proceed to shipping options panel.
    dispatch(nextPanel());
  };
};

const _createCustomer = async (dispatch, getState) => {
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

const _updateCustomer = async (dispatch, getState) => {
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

const _fetchShippingOptions = async (dispatch, getState) => {
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

export const selectShipping = shippingUid => {
  return async (dispatch, getState) => {
    const { checkout } = getState();
    const { cart } = checkout;

    dispatch(selectShippingRequest(shippingUid));

    const results = await ClaretyApi.put(`carts/${cart.uid}/shipping-options/${shippingUid}/`);
    const result = results[0];

    if (result.status === 'error') {
      dispatch(selectShippingFailure(result));
    } else {
      dispatch(selectShippingSuccess(result));
    }
  };
};

export const applyPromoCode = promoCode => {
  return async (dispatch, getState) => {
    const { checkout } = getState();
    const { cart } = checkout;

    dispatch(applyPromoCodeRequest(promoCode));

    const results = await ClaretyApi.put(`carts/${cart.uid}/promo-codes/`);
    const result = results[0];

    if (result.status === 'error') {
      dispatch(applyPromoCodeFailure(result));
    } else {
      dispatch(applyPromoCodeSuccess(result));
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

// Select Shipping

const selectShippingRequest = shippingUid => ({
  type: types.selectShippingRequest,
  shippingUid: shippingUid,
});

const selectShippingSuccess = result => ({
  type: types.selectShippingSuccess,
  result: result,
});

const selectShippingFailure = result => ({
  type: types.selectShippingFailure,
  result: result,
});

// Apply Promo Code

const applyPromoCodeRequest = promoCode => ({
  type: types.applyPromoCodeRequest,
  promoCode: promoCode,
});

const applyPromoCodeSuccess = result => ({
  type: types.applyPromoCodeSuccess,
  result: result,
});

const applyPromoCodeFailure = result => ({
  type: types.applyPromoCodeFailure,
  result: result,
});
