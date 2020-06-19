export const types = {
  // Status Action Types

  statusSet: 'STATUS_SET',

  // Settings Action Types

  fetchEventsRequest: 'FETCH_EVENTS_REQUEST',
  fetchEventsSuccess: 'FETCH_EVENTS_SUCCESS',
  fetchEventsFailure: 'FETCH_EVENTS_FAILURE',

  fetchFullEventRequest: 'FETCH_FULL_EVENT_REQUEST',
  fetchFullEventSuccess: 'FETCH_FULL_EVENT_SUCCESS',
  fetchFullEventFailure: 'FETCH_FULL_EVENT_FAILURE',

  setPriceHandles: 'SET_PRICE_HANDLES',

  // Participant Action Types

  setParticipantQtys:           'SET_PARTICIPANT_QTYS',
  resetParticipantQtys:         'RESET_PARTICIPANT_QTYS',
  setParticipantFirstNames:     'SET_PARTICIPANT_FIRST_NAMES',
  resetParticipantFirstNames:   'RESET_PARTICIPANT_FIRST_NAMES',
  setParticipantOffers:         'SET_PARTICIPANT_OFFERS',
  resetParticipantOffers:       'RESET_PARTICIPANT_OFFERS',
  setParticipantDetails:        'SET_PARTICIPANT_DETAILS',
  resetParticipantDetails:      'RESET_PARTICIPANT_DETAILS',
  setParticipantAdditionalData: 'SET_PARTICIPANT_ADDITIONAL_DATA',
  setParticipantErrors:         'SET_PARTICIPANT_ERRORS',

  // Registration Action Types

  registrationCreateRequest: 'REGISTRATION_CREATE_REQUEST',
  registrationCreateSuccess: 'REGISTRATION_CREATE_SUCCESS',
  registrationCreateFailure: 'REGISTRATION_CREATE_FAILURE',

  fetchShippingOptionsRequest: 'FETCH_SHIPPING_OPTIONS_REQUEST',
  fetchShippingOptionsSuccess: 'FETCH_SHIPPING_OPTIONS_SUCCESS',
  fetchShippingOptionsFailure: 'FETCH_SHIPPING_OPTIONS_FAILURE',

  updateShippingRequest: 'UPDATE_SHIPPING_REQUEST',
  updateShippingSuccess: 'UPDATE_SHIPPING_SUCCESS',
  updateShippingFailure: 'UPDATE_SHIPPING_FAILURE',

  registrationSubmitRequest: 'REGISTRATION_SUBMIT_REQUEST',
  registrationSubmitSuccess: 'REGISTRATION_SUBMIT_SUCCESS',
  registrationSubmitFailure: 'REGISTRATION_SUBMIT_FAILURE',

  // Customer Action Types

  hasAccountRequest: 'HAS_ACCOUNT_REQUEST',
  hasAccountSuccess: 'HAS_ACCOUNT_SUCCESS',
  hasAccountFailure: 'HAS_ACCOUNT_FAILURE',

  resetPasswordRequest: 'RESET_PASSWORD_REQUEST',
  resetPasswordSuccess: 'RESET_PASSWORD_SUCCESS',
  resetPasswordFailure: 'RESET_PASSWORD_FAILURE',

  createAccountRequest: 'CREATE_ACCOUNT_REQUEST',
  createAccountSuccess: 'CREATE_ACCOUNT_SUCCESS',
  createAccountFailure: 'CREATE_ACCOUNT_FAILURE',

  fetchAuthCustomerRequest: 'FETCH_AUTH_CUSTOMER_REQUEST',
  fetchAuthCustomerSuccess: 'FETCH_AUTH_CUSTOMER_SUCCESS',
  fetchAuthCustomerFailure: 'FETCH_AUTH_CUSTOMER_FAILURE',

  updateAuthCustomerRequest: 'UPDATE_AUTH_CUSTOMER_REQUEST',
  updateAuthCustomerSuccess: 'UPDATE_AUTH_CUSTOMER_SUCCESS',
  updateAuthCustomerFailure: 'UPDATE_AUTH_CUSTOMER_FAILURE',

  // Team Action Types

  searchTeamsRequest: 'SEARCH_TEAMS_REQUEST',
  searchTeamsSuccess: 'SEARCH_TEAMS_SUCCESS',

  fetchTeamRequest: 'FETCH_TEAM_REQUEST',
  fetchTeamSuccess: 'FETCH_TEAM_SUCCESS',
  fetchTeamFailure: 'FETCH_TEAM_FAILURE',

  createTeamRequest: 'CREATE_TEAM_REQUEST',
  createTeamSuccess: 'CREATE_TEAM_SUCCESS',
  createTeamFailure: 'CREATE_TEAM_FAILURE',

  checkTeamPasswordRequest: 'CHECK_TEAM_PASSWORD_REQUEST',
  checkTeamPasswordSuccess: 'CHECK_TEAM_PASSWORD_SUCCESS',
  checkTeamPasswordFailure: 'CHECK_TEAM_PASSWORD_FAILURE',

  checkPromoCodeRequest: 'CHECK_PROMO_CODE_REQUEST',
  checkPromoCodeSuccess: 'CHECK_PROMO_CODE_SUCCESS',
  checkPromoCodeFailure: 'CHECK_PROMO_CODE_FAILURE',
};
