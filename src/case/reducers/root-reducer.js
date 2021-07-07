import { combineReducers } from 'redux';
import { statusReducer, settingsReducer, panelManagerReducer, cartReducer } from 'shared/reducers';
import { formDataReducer, errorsReducer } from 'form/reducers';

export const rootReducer = combineReducers({
  status: statusReducer,
  settings: settingsReducer,
  formData: formDataReducer,
  errors: errorsReducer,
  panelManager: panelManagerReducer,
  cart: cartReducer,
});