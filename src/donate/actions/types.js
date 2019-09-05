export const types = {
  // Amount Panel Action Types

  selectFrequency: 'SELECT_FREQUENCY',
  selectAmount:    'SELECT_AMOUNT',

  // Success Panel Action Types

  setSuccessResult: 'SET_SUCCESS_RESULT',

  // API Action Types

  updateCartRequest: 'UPDATE_CART_REQUEST',
  updateCartSuccess: 'UPDATE_CART_SUCCESS',
  updateCartFailure: 'UPDATE_CART_FAILURE',

  makePaymentRequest: 'MAKE_PAYMENT_REQUEST',
  makePaymentSuccess: 'MAKE_PAYMENT_SUCCESS',
  makePaymentFailure: 'MAKE_PAYMENT_FAILURE',

  stripeTokenRequest: 'STRIPE_TOKEN_REQUEST',
  stripeTokenSuccess: 'STRIPE_TOKEN_SUCCESS',
  stripeTokenFailure: 'STRIPE_TOKEN_FAILURE',
};
