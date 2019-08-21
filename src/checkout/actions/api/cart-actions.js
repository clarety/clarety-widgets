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
    const { checkout, login, formData } = getState();

    const postData = parseNestedElements(formData);

    if (login.customer || checkout.cart.customer) {
      await _updateCustomer(dispatch, getState, postData.customer);
    } else {
      await _createCustomer(dispatch, getState, postData.customer);
    }
    
    await _fetchShippingOptions(dispatch, getState);

    // Proceed to shipping options panel.
    dispatch(nextPanel());
  };
};

const _createCustomer = async (dispatch, getState, customerData) => {
  const { checkout } = getState();
  const { cart } = checkout;

  dispatch(createCustomerRequest(customerData));

  let results = await ClaretyApi.post(`carts/${cart.uid}/customers/`, customerData);
  const result = results[0];

  if (result.status === 'error') {
    dispatch(createCustomerFailure(result));
  } else {
    dispatch(createCustomerSuccess(result));
  }
};

const _updateCustomer = async (dispatch, getState, customerData) => {
  const { checkout, login } = getState();
  const { cart } = checkout;
  const customer = login.customer || cart.customer;

  dispatch(updateCustomerRequest(customerData));

  let results = await ClaretyApi.put(`carts/${cart.uid}/customers/${customer.uid}/`, customerData);
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

export const updateSale = () => {
  return async (dispatch, getState) => {
    const { checkout, formData } = getState();
    const { cart } = checkout;

    const postData = parseNestedElements(formData);

    dispatch(updateSaleRequest(postData.sale));

    const results = await ClaretyApi.put(`carts/${cart.uid}/sale/`, postData.sale);
    const result = results[0];

    if (result.status === 'error') {
      dispatch(updateSaleFailure(result));
    } else {
      dispatch(updateSaleSuccess(result));
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

// Update Sale

const updateSaleRequest = putData => ({
  type: types.updateSaleRequest,
  putData: putData,
});

const updateSaleSuccess = result => ({
  type: types.updateSaleSuccess,
  result: result,
});

const updateSaleFailure = result => ({
  type: types.updateSaleFailure,
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
