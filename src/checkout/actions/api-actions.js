import { types } from '.';

export const createSale = () => {
  return (dispatch, getState) => {
    // TODO: make API request.
    // - display errors on failure
    // - redirect on success
    console.log('createSale...');
  };
};

const createSaleRequest = data => ({
  type: types.createSaleRequest,
  data: data,
});

const createSaleSuccess = response => ({
  type: types.createSaleSuccess,
  response: response,
});

const createSaleFailure = response => ({
  type: types.createSaleFailure,
  response: response,
});
