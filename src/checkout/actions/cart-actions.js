import i18next from 'i18next';
import { ClaretyApi } from 'shared/utils/clarety-api';
import { parseNestedElements, toCents } from 'shared/utils';
import { getSetting } from 'shared/selectors';
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

export const createCart = ({ offerUid, quantity }) => {
  return async (dispatch, getState) => {
    const state = getState();
    const storeUid = getSetting(state, 'storeUid');

    dispatch(createCartRequest(storeUid, offerUid, quantity));

    const results = await ClaretyApi.post('carts/items/', { storeUid, offerUid, quantity });
    const result = results[0];

    if (result.status === 'error') {
      dispatch(createCartFailure(result));
      return false;
    } else {
      if (result.jwtSession) {
        ClaretyApi.setJwtSession(result.jwtSession);
      }

      dispatch(createCartSuccess(result));
      return true;
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

export const fetchStripeShippingOptions = (shippingAddress) => {
  return async (dispatch, getState) => {
    const { cart } = getState();

    const address = {
      suburb: shippingAddress.city,
      state: shippingAddress.region,
      postcode: shippingAddress.postalCode,
      country: shippingAddress.country,
    };

    const results = await ClaretyApi.put(`carts/${cart.cartUid}/shipping-options/`, { address });
    return results.map(option => ({
      id: option.shippingUid,
      label: option.label,
      detail: option.expectedDelivery ? `Expected Delivery: ${option.expectedDelivery}` : undefined,
      amount: toCents(option.amount),
    }));
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

export const selectDigitalWalletShippingOption = (shippingUid) => {
  return async (dispatch, getState) => {
    const { cart } = getState();

    const data = { shippingUid };

    dispatch(updateSaleRequest(data));
    const results = await ClaretyApi.put(`carts/${cart.cartUid}/sale/`, data, { locale: i18next.language });
    const result = results[0];

    if (result.status === 'error') {
      dispatch(updateSaleFailure(result));
    } else {
      dispatch(updateSaleSuccess(result));
    }

    return result;
  }
};

export const applyPromoCode = (promoCode) => {
  return async (dispatch, getState) => {
    const { cart } = getState();

    dispatch(applyPromoCodeRequest(promoCode));

    const results = await ClaretyApi.post(`carts/${cart.cartUid}/promo-codes/`, { promoCode }, { locale: i18next.language });
    const result = results[0];

    if (result.status === 'error') {
      dispatch(applyPromoCodeFailure(result));
      return false;
    } else {
      dispatch(applyPromoCodeSuccess(result));
      return true;
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

// Create Cart

function createCartRequest(storeUid, offerUid, quantity) {
  return {
    type: types.createCartRequest,
    storeUid: storeUid,
    offerUid: offerUid,
    quantity: quantity,
  };
}

function createCartSuccess(result) {
  return {
    type: types.createCartSuccess,
    result: result,
  };
}

function createCartFailure(result) {
  return {
    type: types.createCartFailure,
    result: result,
  };
}

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
