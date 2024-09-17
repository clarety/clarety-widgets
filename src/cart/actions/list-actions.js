import i18next from 'i18next';
import { ClaretyApi } from 'shared/utils/clarety-api';
import { types } from '../actions';
import {getCartTotalItemsQty} from "cart/selectors";

export function fetchItems(cartUid) {
  return async (dispatch) => {
    dispatch(fetchItemsRequest(cartUid));

    const results = await ClaretyApi.get(`carts/${cartUid}/`, { locale: i18next.language });
    const result = results[0];

    if (result) {
      dispatch(fetchItemsSuccess(result));
    } else {
      dispatch(fetchItemsFailure());
    }
  };
}

export const updateItemQuantity = (item, newQuantity) => {
  return async (dispatch, getState) => {
    if (newQuantity > 0) {
      dispatch(updateCartItem({ ...item, quantity: newQuantity }));
    } else {
      dispatch(removeCartItem(item));
    }
  };
};

const updateCartItem = item => {
  return async (dispatch, getState) => {
    const { cart } = getState();

    dispatch(updateCartItemRequest(item));

    const results = await ClaretyApi.put(`carts/${cart.cartUid}/items/${item.itemUid}/`, item);
    const result = results[0];

    if (result.status === 'error') {
      dispatch(updateCartItemFailure(result));
      return false;
    } else {
      dispatch(updateCartItemSuccess(result));
      updateCartIcon(getState());
      return true;
    }
  };
};

const removeCartItem = item => {
  return async (dispatch, getState) => {
    const { cart } = getState();

    dispatch(removeCartItemRequest(item));

    const results = await ClaretyApi.delete(`carts/${cart.cartUid}/items/${item.itemUid}/`);
    const result = results[0];

    if (result.status === 'error') {
      dispatch(removeCartItemFailure(result));
      return false;
    } else {
      dispatch(removeCartItemSuccess(result));
      updateCartIcon(getState());
      return true;
    }
  };
}
function updateCartIcon(state){
  let quantity = getCartTotalItemsQty(state);

  if(window.updateCartCount) {
    window.updateCartCount(quantity);
  }
}

//Anything that is within the list actions below of types.*** are found in the types.js as the types.* is used here and in the list-reducer like a constant is used within PHP

// Fetch Items

function fetchItemsRequest(cartUid) {
  return {
    type: types.fetchItemsRequest,
    cartUid,
  };
}

function fetchItemsSuccess(result) {
  return {
    type: types.fetchItemsSuccess,
    result: result,
  };
}

function fetchItemsFailure(result) {
  return {
    type: types.fetchItemsFailure,
    result: result,
  };
}

// Update Cart Item

function updateCartItemRequest(item, quantity) {
  return {
    type: types.updateCartItemRequest,
    item: item,
    quantity: quantity,
  };
}
function updateCartItemSuccess(result) {
  return {
    type: types.updateCartItemSuccess,
    result: result,
  };
}

function updateCartItemFailure(result) {
  return {
    type: types.updateCartItemFailure,
    result: result,
  };
}

// Remove Cart Item

function removeCartItemRequest(item) {
  return {
    type: types.removeCartItemRequest,
    item: item,
  };
}
function removeCartItemSuccess(result) {
  return {
    type: types.removeCartItemSuccess,
    result: result,
  };
}

function removeCartItemFailure(result) {
  return {
    type: types.removeCartItemFailure,
    result: result,
  };
}
