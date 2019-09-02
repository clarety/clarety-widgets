export const types = {
  // Settings Action Types

  fetchEventsRequest: 'FETCH_EVENTS_REQUEST',
  fetchEventsSuccess: 'FETCH_EVENTS_SUCCESS',
  fetchEventsFailure: 'FETCH_EVENTS_FAILURE',

  fetchFullEventRequest: 'FETCH_FULL_EVENT_REQUEST',
  fetchFullEventSuccess: 'FETCH_FULL_EVENT_SUCCESS',
  fetchFullEventFailure: 'FETCH_FULL_EVENT_FAILURE',

  // Panel Action Types

  panelsPush: 'PANELS_PUSH',
  panelsPop:  'PANELS_POP',

  // Form Data Action Types

  updateFormData: 'UPDATE_FORM_DATA',
  resetFormData:  'RESET_FORM_DATA',

  // Panel Data Action Types
  
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

  // Error Action Types

  setErrors: 'SET_ERRORS',
};

export const statuses = {
  initializing:  'initializing',
  fetchingEvent: 'fetching-event',
  validating:    'validating',
  submitting:    'submitting',
  ready:         'ready',
};
