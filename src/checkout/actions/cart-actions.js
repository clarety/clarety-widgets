import { ClaretyApi } from 'clarety-utils';
import { parseNestedElements } from 'shared/utils';
import { types } from 'checkout/actions';

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

export const fetchShippingOptions = () => {
  return async (dispatch, getState) => {
    const { cart } = getState();

    dispatch(fetchShippingOptionsRequest(cart.uid));
    const results = await ClaretyApi.get(`carts/${cart.uid}/shipping-options/`);

    if (!results) {
      dispatch(fetchShippingOptionsFailure());
      return false;
    } else {
      dispatch(fetchShippingOptionsSuccess(results));
      return true;
    }
  };
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
