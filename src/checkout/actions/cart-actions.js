import i18next from 'i18next';
import { ClaretyApi } from 'clarety-utils';
import { parseNestedElements } from 'shared/utils';
import { types } from 'checkout/actions';

export const fetchCart = (cartUid) => {
  return async (dispatch) => {
    dispatch(fetchCartRequest(cartUid));

    const results = await ClaretyApi.get(`carts/${cartUid}/`, { locale: i18next.language });
    const result = results[0];

    if (result.status === 'error') {
      dispatch(fetchCartFailure(result));
    } else {
      dispatch(fetchCartSuccess(result));
    }
  };
};

export const removeItem = (itemUid) => {
  return async (dispatch, getState) => {
    const { cart } = getState();

    dispatch(removeItemRequest(cart.cartUid));
    const results = await ClaretyApi.delete(`carts/${cart.cartUid}/items/${itemUid}/`, { locale: i18next.language });
    const result = results[0];

    if (!results) {
      dispatch(removeItemFailure());
      return false;
    } else {
      dispatch(removeItemSuccess(result));
      return true;
    }
  };
};

export const fetchShippingOptions = () => {
  return async (dispatch, getState) => {
    const { cart } = getState();

    dispatch(fetchShippingOptionsRequest(cart.cartUid));
    const results = await ClaretyApi.get(`carts/${cart.cartUid}/shipping-options/`);

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

    const results = await ClaretyApi.put(`carts/${cart.cartUid}/sale/`, postData.sale, { locale: i18next.language });
    const result = results[0];

    if (result.status === 'error') {
      dispatch(updateSaleFailure(result));
    } else {
      dispatch(updateSaleSuccess(result));
    }
  };
};

export const applyPromoCode = (promoCode) => {
  return async (dispatch, getState) => {
    const { cart } = getState();

    dispatch(applyPromoCodeRequest(promoCode));

    const results = await ClaretyApi.post(`carts/${cart.cartUid}/promo-codes/`, { promoCode }, { locale: i18next.language });
    const result = results[0];

    if (result.status === 'error') {
      dispatch(applyPromoCodeFailure(result));
    } else {
      dispatch(applyPromoCodeSuccess(result));
    }
  };
};


// Fetch Cart

const fetchCartRequest = (id) => ({
  type: types.fetchCartRequest,
  id: id,
});

const fetchCartSuccess = (result) => ({
  type: types.fetchCartSuccess,
  result: result,
});

const fetchCartFailure = (result) => ({
  type: types.fetchCartFailure,
  result: result,
});

// Remove Item

const removeItemRequest = (itemUid) => ({
  type: types.removeItemRequest,
  itemUid: itemUid,
});

const removeItemSuccess = (result) => ({
  type: types.removeItemSuccess,
  result: result,
});

const removeItemFailure = () => ({
  type: types.removeItemFailure,
});

// Fetch Shipping Options

const fetchShippingOptionsRequest = (cartUid) => ({
  type: types.fetchShippingOptionsRequest,
  cartUid: cartUid,
});

const fetchShippingOptionsSuccess = (results) => ({
  type: types.fetchShippingOptionsSuccess,
  results: results,
});

const fetchShippingOptionsFailure = () => ({
  type: types.fetchShippingOptionsFailure,
});

// Update Sale

const updateSaleRequest = (putData) => ({
  type: types.updateSaleRequest,
  putData: putData,
});

const updateSaleSuccess = (result) => ({
  type: types.updateSaleSuccess,
  result: result,
});

const updateSaleFailure = (result) => ({
  type: types.updateSaleFailure,
  result: result,
});

// Apply Promo Code

const applyPromoCodeRequest = (promoCode) => ({
  type: types.applyPromoCodeRequest,
  promoCode: promoCode,
});

const applyPromoCodeSuccess = (result) => ({
  type: types.applyPromoCodeSuccess,
  result: result,
});

const applyPromoCodeFailure = (result) => ({
  type: types.applyPromoCodeFailure,
  result: result,
});
