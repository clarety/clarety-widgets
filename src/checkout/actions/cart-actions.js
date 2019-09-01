import { ClaretyApi } from 'clarety-utils';
import { parseNestedElements } from 'shared/utils';
import { types, panels, nextPanel, updateFormData, invalidatePanel, setErrors } from 'checkout/actions';

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
    const state = getState();

    // Update form data and reset shipping options.

    const formData = { ...state.formData };

    formData['sale.shippingOption'] = undefined;
    
    if (formData['billingIsSameAsShipping']) {
      formData['customer.billing.address1'] = formData['customer.delivery.address1'];
      formData['customer.billing.suburb']   = formData['customer.delivery.suburb'];
      formData['customer.billing.state']    = formData['customer.delivery.state'];
      formData['customer.billing.postcode'] = formData['customer.delivery.postcode'];
    }
    
    dispatch(updateFormData(formData));
    dispatch(invalidatePanel(panels.shippingOptionsPanel));

    // Create or update customer.

    const postData = parseNestedElements(formData);

    let didSucceed;
    if (state.cart.customer) {
      didSucceed = await _updateCustomer(dispatch, getState, postData.customer);
    } else {
      didSucceed = await _createCustomer(dispatch, getState, postData.customer);
    }

    if (didSucceed) {
      // Fetch shipping options then Proceed to shipping options panel.
      await _fetchShippingOptions(dispatch, getState);
      dispatch(nextPanel());
    } else {
      // Errors will have been set,
      // and panels containing errors will show automatically.
    }
  };
};

const _createCustomer = async (dispatch, getState, customerData) => {
  const { cart } = getState();

  dispatch(createCustomerRequest(customerData));

  let results = await ClaretyApi.post(`carts/${cart.uid}/customers/`, customerData);
  const result = results[0];

  if (result.status === 'error') {
    dispatch(createCustomerFailure(result));
    dispatch(setErrors(result.validationErrors));
  } else {
    dispatch(createCustomerSuccess(result));
  }

  return result.status !== 'error';
};

const _updateCustomer = async (dispatch, getState, customerData) => {
  const { cart } = getState();
  const { customer } = cart;

  dispatch(updateCustomerRequest(customerData));

  let results = await ClaretyApi.put(`carts/${cart.uid}/customers/${customer.uid}/`, customerData);
  const result = results[0];

  if (result.status === 'error') {
    dispatch(updateCustomerFailure(result));
    dispatch(setErrors(result.validationErrors));
  } else {
    dispatch(updateCustomerSuccess(result));
  }

  return result.status !== 'error';
};

const _fetchShippingOptions = async (dispatch, getState) => {
  const { cart } = getState();

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
    const { cart, formData } = getState();

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
    const { cart } = getState();

    dispatch(applyPromoCodeRequest(promoCode));

    const results = await ClaretyApi.put(`carts/${cart.uid}/promo-codes/`);
    const result = results[0];

    if (result.status === 'error') {
      dispatch(applyPromoCodeFailure(result));
      dispatch(setErrors(result.validationErrors));
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
