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
  return async (dispatch) => {

    //Create an object to give to the api
    let updateItem = item;
    updateItem.quantity = newQuantity;

    dispatch(updateItemRequest(updateItem));

    const results = await ClaretyApi.post('update-cart-item/', updateItem);
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

function updateItemRequest(item) {
  return {
    type: types.updateItemRequest,
    item: item
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
