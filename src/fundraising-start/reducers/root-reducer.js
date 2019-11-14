import { combineReducers } from 'redux';
import { statusReducer, settingsReducer, authReducer, panelManagerReducer, cartReducer } from 'shared/reducers';
import { formDataReducer, errorsReducer } from 'form/reducers';

export const rootReducer = combineReducers({
  status: statusReducer,
  settings: settingsReducer,
  auth: authReducer,
  panelManager: panelManagerReducer,
  cart: cartReducer,
  formData: formDataReducer,
  errors: errorsReducer,
});
