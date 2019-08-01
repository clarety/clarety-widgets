import { ClaretyApi } from 'clarety-utils';
import { types } from '.';

export const fetchCart = () => {
  return async dispatch => {
    // TODO: where does cart id come from? cookies?
    const cartId = '123-cart-id';

    dispatch(fetchCartRequest(cartId));

    const results = await ClaretyApi.get('checkout/cart/', cartId);
    const result = results[0];

    if (result.status === 'error') {
      dispatch(fetchCartFailure(result));
    } else {
      dispatch(fetchCartSuccess(result));
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
