export const types = {
  // Status Action Types

  setStatus: 'SET_STATUS',

  // Explain Action Types

  explainFetchRequest: 'EXPLAIN_FETCH_REQUEST',
  explainFetchSuccess: 'EXPLAIN_FETCH_SUCCESS',
  explainFetchFailure: 'EXPLAIN_FETCH_FAILURE',

  setVariant:          'SET_VARIANT',
  setConfirmPageUrl:   'SET_CONFIRM_PAGE_URL',

  // Cart Action Types

  addItem:        'ADD_ITEM',
  clearItems:     'CLEAR_ITEMS',

  setPayment:     'SET_PAYMENT',
  clearPayment:   'CLEAR_PAYMENT',

  updateCartData: 'UPDATE_CART_DATA',

  setStore:       'SET_STORE',
  setCustomer:    'SET_CUSTOMER',
  setTracking:    'SET_TRACKING',
  setRecaptcha:   'SET_RECAPTCHA',

  // Auth Action Types

  loginRequest:  'LOGIN_REQUEST',
  loginSuccess:  'LOGIN_SUCCESS',
  loginFailure:  'LOGIN_FAILURE',

  logoutRequest: 'LOGOUT_REQUEST',
  logoutSuccess: 'LOGOUT_SUCCESS',
  logoutFailure: 'LOGOUT_FAILURE',

  // Panel Manager Action Types

  setPanels:       'SET_PANELS',
  pushPanel:       'PUSH_PANEL',
  popToPanel:      'POP_TO_PANEL',
  setPanelStatus:  'SET_PANEL_STATUS',
  invalidatePanel: 'INVALIDATE_PANEL',
  resetAllPanels:  'RESET_ALL_PANELS',

  // Login Panel Action Types

  setLoginPanelMode: 'SET_LOGIN_PANEL_MODE',
};
