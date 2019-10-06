import { combineReducers } from 'redux';
import { statusReducer, settingsReducer, authReducer, panelManagerReducer } from 'shared/reducers';
import { formDataReducer } from 'form/reducers';
import { errorsReducer, cartReducer } from 'checkout/reducers';

export const rootReducer = combineReducers({
  status: statusReducer,
  settings: settingsReducer,
  errors: errorsReducer,

  auth: authReducer,
  cart: cartReducer,
  formData: formDataReducer,

  panelManager: panelManagerReducer,
});
