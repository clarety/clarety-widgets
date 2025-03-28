export const types = {
  // Amount Action Types
  selectFrequency: 'SELECT_FREQUENCY',
  selectAmount:    'SELECT_AMOUNT',
  selectSchedule:  'SELECT_SCHEDULE',
  selectDefaults:  'SELECT_DEFAULTS',

  // RG Upsell Action Types
  setRgUpsell: 'SET_RG_UPSELL',
  clearRgUpsell: 'CLEAR_RG_UPSELL',
  
  // Payment Action Types
  makePaymentRequest: 'MAKE_PAYMENT_REQUEST',
  makePaymentSuccess: 'MAKE_PAYMENT_SUCCESS',
  makePaymentFailure: 'MAKE_PAYMENT_FAILURE',

  // Fetch Payment Methods Types
  fetchPaymentMethodsRequest: 'FETCH_PAYMENT_METHODS_REQUEST',
  fetchPaymentMethodsSuccess: 'FETCH_PAYMENT_METHODS_SUCCESS',
  fetchPaymentMethodsFailure: 'FETCH_PAYMENT_METHODS_FAILURE',

  // Customer Action Types
  fetchDonationCustomerRequest: 'FETCH_DONATION_CUSTOMER_REQUEST',
  fetchDonationCustomerSuccess: 'FETCH_DONATION_CUSTOMER_SUCCESS',
  fetchDonationCustomerFailure: 'FETCH_DONATION_CUSTOMER_FAILURE',
};
