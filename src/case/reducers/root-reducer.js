import { combineReducers } from 'redux';
import { statusReducer, settingsReducer, panelManagerReducer, authReducer } from 'shared/reducers';
import { formDataReducer, errorsReducer } from 'form/reducers';
import { cartReducer } from 'checkout/reducers';

export const rootReducer = combineReducers({
  status: statusReducer,
  settings: settingsReducer,
  auth: authReducer,
  formData: formDataReducer,
  errors: errorsReducer,
  panelManager: panelManagerReducer,
  cart: cartReducer,
});
