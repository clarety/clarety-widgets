import { ClaretyApi } from 'clarety-utils';
import { types } from '../actions';

export function fetchSalelines() {
  return async dispatch => {
    dispatch(fetchSalelinesRequest());

    const result = await ClaretyApi.get('sale/', {id:102010});

    if (result[0]) {
      dispatch(fetchSalelinesSuccess(result[0]));
    } else {
      dispatch(fetchSalelinesFailure());
    }
  };
}

export const updateSalelineQuantity = () => {
  console.log('updateSalelineQuantity');
  return async (dispatch, getState) => {
    console.log('in async');
    const { saleline } = getState();

    dispatch(updateSalelineRequest(saleline));

    const results = await ClaretyApi.post('update-saleline/', saleline);
    const result = results[0];

    if (result.status === 'error') {
      dispatch(updateSalelineFailure(result));
    } else {
      dispatch(fetchSalelines());
      dispatch(updateSalelineSuccess(result));
    }
  };
};

//Anything that is within the list actions below of types.*** are found in the types.js as the types.* is used here and in the list-reducer like a constant is used within PHP
// Fetch List
function fetchSalelinesRequest(isBusy) {
  return {
    type: types.fetchSalelinesRequest,
    isBusy: isBusy
  };
}

function fetchSalelinesSuccess(result) {
  return {
    type: types.fetchSalelinesSuccess,
    result: result,
  };
}

function fetchSalelinesFailure(result) {
  return {
    type: types.fetchSalelinesFailure,
    result: result,
  };
}

// Action
function updateSalelineRequest(item) {
  return {
    type: types.updateSalelineRequest,
    item: item
  };
}
function updateSalelineSuccess(result) {
  return {
    type: types.updateSalelineSuccess,
    result: result,
  };
}

function updateSalelineFailure(result) {
  return {
    type: types.updateSalelineFailure,
    result: result,
  };
}