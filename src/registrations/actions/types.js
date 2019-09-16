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

  // Panel Stack Action Types

  panelStackPush: 'PANEL_STACK_PUSH',
  panelStackPop:  'PANEL_STACK_POP',

  // Panel Data Action Types

  panelDataSetEvent:          'PANEL_DATA_SET_EVENT',
  panelDataResetEvent:        'PANEL_DATA_RESET_EVENT',
  panelDataSetQtys:           'PANEL_DATA_SET_QTYS',
  panelDataResetQtys:         'PANEL_DATA_RESET_QTYS',
  panelDataSetFirstNames:     'PANEL_DATA_SET_FIRST_NAMES',
  panelDataResetFirstNames:   'PANEL_DATA_RESET_FIRST_NAMES',
  panelDataSetDetails:        'PANEL_DATA_SET_DETAILS',
  panelDataSetAdditionalData: 'PANEL_DATA_SET_ADDITIONAL_DATA',
  panelDataSetErrors:         'PANEL_DATA_SET_ERRORS',
  panelDataResetDetails:      'PANEL_DATA_RESET_DETAILS',

  // Cart Action Types

  registrationCreateRequest: 'REGISTRATION_CREATE_REQUEST',
  registrationCreateSuccess: 'REGISTRATION_CREATE_SUCCESS',
  registrationCreateFailure: 'REGISTRATION_CREATE_FAILURE',

  registrationSubmitRequest: 'REGISTRATION_SUBMIT_REQUEST',
  // NOTE: there's no registrationSubmitSuccess action, we just redirect.
  registrationSubmitFailure: 'REGISTRATION_SUBMIT_FAILURE',
};

export const statuses = {
  initializing: 'INITIALIZING',
  validating:   'VALIDATING',
  submitting:   'SUBMITTING',
  ready:        'READY',
};
