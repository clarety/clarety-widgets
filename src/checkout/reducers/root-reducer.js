import { combineReducers } from 'redux';
import { authReducer, loginPanelReducer, panelManagerReducer } from 'shared/reducers';
import { formDataReducer } from 'form/reducers';
import { statusReducer, errorsReducer, cartReducer } from 'checkout/reducers';

export const rootReducer = combineReducers({
  status: statusReducer,
  errors: errorsReducer,

  auth: authReducer,
  cart: cartReducer,
  formData: formDataReducer,

  panelManager: panelManagerReducer,
  panels: combineReducers({
    loginPanel: loginPanelReducer,
  }),
});
