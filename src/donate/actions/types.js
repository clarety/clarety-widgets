export const types = {
  // Amount Action Types
  selectFrequency: 'SELECT_FREQUENCY',
  selectAmount:    'SELECT_AMOUNT',
  selectSchedule:  'SELECT_SCHEDULE',
  selectDefaults:  'SELECT_DEFAULTS',

  // Payment Action Types
  makePaymentRequest: 'MAKE_PAYMENT_REQUEST',
  makePaymentSuccess: 'MAKE_PAYMENT_SUCCESS',
  makePaymentFailure: 'MAKE_PAYMENT_FAILURE',

  // Customer Action Types
  fetchDonationCustomerRequest: 'FETCH_DONATION_CUSTOMER_REQUEST',
  fetchDonationCustomerSuccess: 'FETCH_DONATION_CUSTOMER_SUCCESS',
  fetchDonationCustomerFailure: 'FETCH_DONATION_CUSTOMER_FAILURE',
};
