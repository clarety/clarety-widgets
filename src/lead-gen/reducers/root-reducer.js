import { combineReducers } from 'redux';
import { statusReducer, settingsReducer, panelManagerReducer } from 'shared/reducers';
import { formDataReducer, errorsReducer } from 'form/reducers';

export const rootReducer = combineReducers({
  status: statusReducer,
  settings: settingsReducer,
  panelManager: panelManagerReducer,
  formData: formDataReducer,
  errors: errorsReducer,
});
