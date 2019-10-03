import { ClaretyApi } from 'clarety-utils';
import { types } from '../actions';

export function fetchItems(cartUid) {
  return async dispatch => {
    dispatch(fetchItemsRequest());

    const results = await ClaretyApi.get(`carts/${cartUid}/`);
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
      return true;
    }
  };
}


//Anything that is within the list actions below of types.*** are found in the types.js as the types.* is used here and in the list-reducer like a constant is used within PHP

// Fetch Items

function fetchItemsRequest() {
  return {
    type: types.fetchItemsRequest,
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
