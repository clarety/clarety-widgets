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

  // Panel Data Action Types

  panelDataSetEvent:          'PANEL_DATA_SET_EVENT',
  panelDataResetEvent:        'PANEL_DATA_RESET_EVENT',
  panelDataSetQtys:           'PANEL_DATA_SET_QTYS',
  panelDataResetQtys:         'PANEL_DATA_RESET_QTYS',
  panelDataSetFirstNames:     'PANEL_DATA_SET_FIRST_NAMES',
  panelDataResetFirstNames:   'PANEL_DATA_RESET_FIRST_NAMES',
  panelDataSetOffers:         'PANEL_DATA_SET_OFFERS',
  panelDataResetOffers:       'PANEL_DATA_RESET_OFFERS',
  panelDataSetDetails:        'PANEL_DATA_SET_DETAILS',
  panelDataSetAdditionalData: 'PANEL_DATA_SET_ADDITIONAL_DATA',
  panelDataSetErrors:         'PANEL_DATA_SET_ERRORS',
  panelDataResetDetails:      'PANEL_DATA_RESET_DETAILS',

  // Cart Action Types

  setRegistrationMode:       'SET_REGISTRATION_MODE',

  registrationCreateRequest: 'REGISTRATION_CREATE_REQUEST',
  registrationCreateSuccess: 'REGISTRATION_CREATE_SUCCESS',
  registrationCreateFailure: 'REGISTRATION_CREATE_FAILURE',

  registrationFetchRequest:  'REGISTRATION_FETCH_REQUEST',
  registrationFetchSuccess:  'REGISTRATION_FETCH_SUCCESS',

  registrationSubmitRequest: 'REGISTRATION_SUBMIT_REQUEST',
  // NOTE: there's no registrationSubmitSuccess action, we just redirect.
  registrationSubmitFailure: 'REGISTRATION_SUBMIT_FAILURE',

  // Customer Action Types

  hasAccountRequest: 'HAS_ACCOUNT_REQUEST',
  hasAccountSuccess: 'HAS_ACCOUNT_SUCCESS',
  hasAccountFailure: 'HAS_ACCOUNT_FAILURE',

  createAccountRequest: 'CREATE_ACCOUNT_REQUEST',
  createAccountSuccess: 'CREATE_ACCOUNT_SUCCESS',
  createAccountFailure: 'CREATE_ACCOUNT_FAILURE',

  fetchAuthCustomerRequest: 'FETCH_AUTH_CUSTOMER_REQUEST',
  fetchAuthCustomerSuccess: 'FETCH_AUTH_CUSTOMER_SUCCESS',
  fetchAuthCustomerFailure: 'FETCH_AUTH_CUSTOMER_FAILURE',

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

  selectTeam: 'SELECT_TEAM',

  setTeamPanelMode: 'SET_TEAM_PANEL_MODE',
};
