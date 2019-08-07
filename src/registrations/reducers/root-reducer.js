import { combineReducers } from 'redux';
import { statusReducer, initReducer, panelStackReducer, panelDataReducer, registrationReducer } from 'registrations/reducers';

export const rootReducer = combineReducers({
  status:       statusReducer,
  init:         initReducer,
  panelStack:   panelStackReducer,
  panelData:    panelDataReducer,
  registration: registrationReducer,
});
