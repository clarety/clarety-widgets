export const types = {
  // Customer Action Types

  hasAccountRequest: 'HAS_ACCOUNT_REQUEST',
  hasAccountSuccess: 'HAS_ACCOUNT_SUCCESS',
  hasAccountFailure: 'HAS_ACCOUNT_FAILURE',

  fetchCustomerRequest: 'FETCH_CUSTOMER_REQUEST',
  fetchCustomerSuccess: 'FETCH_CUSTOMER_SUCCESS',
  fetchCustomerFailure: 'FETCH_CUSTOMER_FAILURE',

  // Cart Action Types

  fetchCartRequest: 'FETCH_CART_REQUEST',
  fetchCartSuccess: 'FETCH_CART_SUCCESS',
  fetchCartFailure: 'FETCH_CART_FAILURE',

  addDonationRequest: 'ADD_DONATION_REQUEST',
  addDonationSuccess: 'ADD_DONATION_SUCCESS',
  addDonationFailure: 'ADD_DONATION_FAILURE',

  removeItemRequest: 'REMOVE_ITEM_REQUEST',
  removeItemSuccess: 'REMOVE_ITEM_SUCCESS',
  removeItemFailure: 'REMOVE_ITEM_FAILURE',

  createCustomerRequest: 'CREATE_CUSTOMER_REQUEST',
  createCustomerSuccess: 'CREATE_CUSTOMER_SUCCESS',
  createCustomerFailure: 'CREATE_CUSTOMER_FAILURE',

  updateCustomerRequest: 'UPDATE_CUSTOMER_REQUEST',
  updateCustomerSuccess: 'UPDATE_CUSTOMER_SUCCESS',
  updateCustomerFailure: 'UPDATE_CUSTOMER_FAILURE',

  fetchShippingOptionsRequest: 'FETCH_SHIPPING_OPTIONS_REQUEST',
  fetchShippingOptionsSuccess: 'FETCH_SHIPPING_OPTIONS_SUCCESS',
  fetchShippingOptionsFailure: 'FETCH_SHIPPING_OPTIONS_FAILURE',

  updateSaleRequest: 'UPDATE_SALE_REQUEST',
  updateSaleSuccess: 'UPDATE_SALE_SUCCESS',
  updateSaleFailure: 'UPDATE_SALE_FAILURE',

  applyPromoCodeRequest: 'APPLY_PROMO_CODE_REQUEST',
  applyPromoCodeSuccess: 'APPLY_PROMO_CODE_SUCCESS',
  applyPromoCodeFailure: 'APPLY_PROMO_CODE_FAILURE',

  // Payment Action Types

  fetchPaymentMethodsRequest: 'FETCH_PAYMENT_METHODS_REQUEST',
  fetchPaymentMethodsSuccess: 'FETCH_PAYMENT_METHODS_SUCCESS',
  fetchPaymentMethodsFailure: 'FETCH_PAYMENT_METHODS_FAILURE',

  makePaymentRequest: 'MAKE_PAYMENT_REQUEST',
  makePaymentSuccess: 'MAKE_PAYMENT_SUCCESS',
  makePaymentFailure: 'MAKE_PAYMENT_FAILURE',

  stripeTokenRequest: 'STRIPE_TOKEN_REQUEST',
  stripeTokenSuccess: 'STRIPE_TOKEN_SUCCESS',
  stripeTokenFailure: 'STRIPE_TOKEN_FAILURE',
};
