export const types = {
  // Amount Action Types

  selectFrequency: 'SELECT_FREQUENCY',
  selectAmount:    'SELECT_AMOUNT',
  selectDefaults:  'SELECT_DEFAULTS',

  // Payment Action Types

  makePaymentRequest: 'MAKE_PAYMENT_REQUEST',
  makePaymentSuccess: 'MAKE_PAYMENT_SUCCESS',
  makePaymentFailure: 'MAKE_PAYMENT_FAILURE',

  stripeTokenRequest: 'STRIPE_TOKEN_REQUEST',
  stripeTokenSuccess: 'STRIPE_TOKEN_SUCCESS',
  stripeTokenFailure: 'STRIPE_TOKEN_FAILURE',
};
