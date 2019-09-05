import { types } from 'donate/actions';

// Update Cart

export const updateCartRequest = postData => ({
  type: types.updateCartRequest,
  postData: postData,
});

export const updateCartSuccess = result => ({
  type: types.updateCartSuccess,
  result: result,
});

export const updateCartFailure = result => ({
  type: types.updateCartFailure,
  result: result,
});

// Make Payment

export const makePaymentRequest = postData => ({
  type: types.makePaymentRequest,
  postData: postData,
});

export const makePaymentSuccess = result => ({
  type: types.makePaymentSuccess,
  result: result,
});

export const makePaymentFailure = result => ({
  type: types.makePaymentFailure,
  result: result,
});

// Stripe Token

export const stripeTokenRequest = postData => ({
  type: types.stripeTokenRequest,
  postData: postData,
});

export const stripeTokenSuccess = result => ({
  type: types.stripeTokenSuccess,
  result: result,
});

export const stripeTokenFailure = result => ({
  type: types.stripeTokenFailure,
  result: result,
});
