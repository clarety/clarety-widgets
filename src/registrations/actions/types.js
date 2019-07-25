export const types = {
  // Status Action Types
  statusSet: 'STATUS_SET',

  // Init Action Types
  initFetchRequest: 'INIT_FETCH_REQUEST',
  initFetchSuccess: 'INIT_FETCH_SUCCESS',
  initFetchFailure: 'INIT_FETCH_FAILURE',

  // Panel Stack Action Types
  panelStackPush: 'PANEL_STACK_PUSH',
  panelStackPop:  'PANEL_STACK_POP',

  // Panel Data Action Types
  panelDataSetEvent:        'PANEL_DATA_SET_EVENT',
  panelDataResetEvent:      'PANEL_DATA_RESET_EVENT',
  panelDataSetQtys:         'PANEL_DATA_SET_QTYS',
  panelDataResetQtys:       'PANEL_DATA_RESET_QTYS',
  panelDataSetFirstNames:   'PANEL_DATA_SET_FIRST_NAMES',
  panelDataResetFirstNames: 'PANEL_DATA_RESET_FIRST_NAMES',
  panelDataSetDetails:      'PANEL_DATA_SET_DETAILS',
  panelDataResetDetails:    'PANEL_DATA_RESET_DETAILS',

  // Registration Action Types
  registrationCreateRequest: 'REGISTRATION_CREATE_REQUEST',
  registrationCreateSuccess: 'REGISTRATION_CREATE_SUCCESS',
  registrationCreateFailure: 'REGISTRATION_CREATE_FAILURE',

  registrationSubmitRequest: 'REGISTRATION_SUBMIT_REQUEST',
  registrationSubmitSuccess: 'REGISTRATION_SUBMIT_SUCCESS',
  registrationSubmitFailure: 'REGISTRATION_SUBMIT_FAILURE',
};

export const statuses = {
  initializing: 'INITIALIZING',
  validating:   'VALIDATING',
  submitting:   'SUBMITTING',
  ready:        'READY',
  complete:     'COMPLETE',
};
