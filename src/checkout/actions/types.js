export const types = {
  // Panel Action Types

  setPanels:   'SET_PANELS',
  nextPanel:   'NEXT_PANEL',
  editPanel:   'EDIT_PANEL',
  resetPanels: 'RESET_PANELS',

  resetShippingOptionsPanel: 'RESET_SHIPPING_OPTIONS_PANEL',

  // Form Data Action Types

  updateFormData: 'UPDATE_FORM_DATA',
  resetFormData:  'RESET_FORM_DATA',

  // API Action Types

  fetchCartRequest: 'FETCH_CART_REQUEST',
  fetchCartSuccess: 'FETCH_CART_SUCCESS',
  fetchCartFailure: 'FETCH_CART_FAILURE',

  customerSearchRequest: 'CUSTOMER_SEARCH_REQUEST',
  customerSearchSuccess: 'CUSTOMER_SEARCH_SUCCESS',
  customerSearchFailure: 'CUSTOMER_SEARCH_FAILURE',

  resetEmailStatus: 'RESET_EMAIL_STATUS',

  loginRequest: 'LOGIN_REQUEST',
  loginSuccess: 'LOGIN_SUCCESS',
  loginFailure: 'LOGIN_FAILURE',

  logout: 'LOGOUT',

  createAccountRequest: 'CREATE_ACCOUNT_REQUEST',
  createAccountSuccess: 'CREATE_ACCOUNT_SUCCESS',
  createAccountFailure: 'CREATE_ACCOUNT_FAILURE',

  fetchCustomerRequest: 'FETCH_CUSTOMER_REQUEST',
  fetchCustomerSuccess: 'FETCH_CUSTOMER_SUCCESS',
  fetchCustomerFailure: 'FETCH_CUSTOMER_FAILURE',

  createCustomerRequest: 'CREATE_CUSTOMER_REQUEST',
  createCustomerSuccess: 'CREATE_CUSTOMER_SUCCESS',
  createCustomerFailure: 'CREATE_CUSTOMER_FAILURE',

  updateCustomerRequest: 'UPDATE_CUSTOMER_REQUEST',
  updateCustomerSuccess: 'UPDATE_CUSTOMER_SUCCESS',
  updateCustomerFailure: 'UPDATE_CUSTOMER_FAILURE',

  fetchShippingOptionsRequest: 'FETCH_SHIPPING_OPTIONS_REQUEST',
  fetchShippingOptionsSuccess: 'FETCH_SHIPPING_OPTIONS_SUCCESS',
  fetchShippingOptionsFailure: 'FETCH_SHIPPING_OPTIONS_FAILURE',

  selectShippingRequest: 'SELECT_SHIPPING_REQUEST',
  selectShippingSuccess: 'SELECT_SHIPPING_SUCCESS',
  selectShippingFailure: 'SELECT_SHIPPING_FAILURE',

  applyPromoCodeRequest: 'APPLY_PROMO_CODE_REQUEST',
  applyPromoCodeSuccess: 'APPLY_PROMO_CODE_SUCCESS',
  applyPromoCodeFailure: 'APPLY_PROMO_CODE_FAILURE',

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
