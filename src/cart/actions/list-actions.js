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
    const { cart } = getState();

    dispatch(updateItemRequest(item, newQuantity));

    const results = await ClaretyApi.put(`carts/${cart.cartUid}/items/${item.itemUid}/`, { quantity: newQuantity });
    const result = results[0];

    if (result.status === 'error') {
      dispatch(updateItemFailure(result));
    } else {
      dispatch(updateItemSuccess(result));
    }
  };
};

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

// Update Item

function updateItemRequest(item, quantity) {
  return {
    type: types.updateItemRequest,
    item: item,
    quantity: quantity,
  };
}
function updateItemSuccess(result) {
  return {
    type: types.updateItemSuccess,
    result: result,
  };
}

function updateItemFailure(result) {
  return {
    type: types.updateItemFailure,
    result: result,
  };
}
