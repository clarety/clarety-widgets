export const types = {
  // Panel Action Types

  setPanels: 'SET_PANELS',
  nextPanel: 'NEXT_PANEL',
  editPanel: 'EDIT_PANEL',

  // Form Data Action Types

  updateFormData: 'UPDATE_FORM_DATA',

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

  updateCheckoutRequest: 'UPDATE_CHECKOUT_REQUEST',
  updateCheckoutSuccess: 'UPDATE_CHECKOUT_SUCCESS',
  updateCheckoutFailure: 'UPDATE_CHECKOUT_FAILURE',

  stripeTokenRequest: 'STRIPE_TOKEN_REQUEST',
  stripeTokenSuccess: 'STRIPE_TOKEN_SUCCESS',
  stripeTokenFailure: 'STRIPE_TOKEN_FAILURE',
};
