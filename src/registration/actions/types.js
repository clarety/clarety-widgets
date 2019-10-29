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
  selectParticipantAddOn:       'SELECT_PARTICIPANT_ADD_ON',
  deselectParticipantAddOn:     'DESELECT_PARTICIPANT_ADD_ON',
  setParticipantErrors:         'SET_PARTICIPANT_ERRORS',

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
};
