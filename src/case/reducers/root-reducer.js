import { combineReducers } from 'redux';
import { statusReducer, settingsReducer, panelManagerReducer, cartReducer, authReducer } from 'shared/reducers';
import { formDataReducer, errorsReducer } from 'form/reducers';

export const rootReducer = combineReducers({
  status: statusReducer,
  settings: settingsReducer,
  auth: authReducer,
  formData: formDataReducer,
  errors: errorsReducer,
  panelManager: panelManagerReducer,
  cart: cartReducer,
});
