export const types = {
  // Status Action Types

  setStatus: 'SET_STATUS',

  // Settings Action Types

  updateSettings:       'UPDATE_SETTINGS',
  updatePanelSettings:  'UPDATE_PANEL_SETTINGS',

  fetchSettingsRequest: 'FETCH_SETTINGS_REQUEST',
  fetchSettingsSuccess: 'FETCH_SETTINGS_SUCCESS',
  fetchSettingsFailure: 'FETCH_SETTINGS_FAILURE',

  // Cart Action Types

  addItem:               'ADD_ITEM',
  updateItem:            'UPDATE_ITEM',
  removeItem:            'REMOVE_ITEM',
  clearItems:            'CLEAR_ITEMS',
  removeItemsWithPanel:  'REMOVE_ITEMS_WITH_PANEL',
  removeItemsWithType:   'REMOVE_ITEMS_WITH_TYPE',

  setCustomer:           'SET_CUSTOMER',
  updateCustomer:        'UPDATE_CUSTOMER',

  setPayment:            'SET_PAYMENT',
  clearPayment:          'CLEAR_PAYMENT',

  updateCartData:        'UPDATE_CART_DATA',

  setStore:              'SET_STORE',
  setOrganisation:       'SET_ORGANISATION',
  setPromoCode:          'SET_PROMO_CODE',
  setTrackingData:       'SET_TRACKING_DATA',

  setRecaptcha:          'SET_RECAPTCHA',
  clearRecaptcha:        'CLEAR_RECAPTCHA',

  setTurnstileToken:     'SET_TURNSTILE_TOKEN',

  // Auth Action Types

  setAuth: 'SET_AUTH',

  loginRequest:  'LOGIN_REQUEST',
  loginSuccess:  'LOGIN_SUCCESS',
  loginFailure:  'LOGIN_FAILURE',

  logoutRequest: 'LOGOUT_REQUEST',
  logoutSuccess: 'LOGOUT_SUCCESS',
  logoutFailure: 'LOGOUT_FAILURE',

  // Panel Manager Action Types

  setPanels:       'SET_PANELS',
  insertPanels:    'INSERT_PANELS',
  removePanels:    'REMOVE_PANELS',
  setPanelStatus:  'SET_PANEL_STATUS',
  invalidatePanel: 'INVALIDATE_PANEL',
  resetAllPanels:  'RESET_ALL_PANELS',
};
