import { combineReducers } from 'redux';
import { authReducer, loginPanelReducer } from 'shared/reducers';
import { formDataReducer } from 'form/reducers';
import { statusReducer, errorsReducer, cartReducer, panelStackReducer } from 'checkout/reducers';

export const rootReducer = combineReducers({
  status: statusReducer,
  errors: errorsReducer,

  auth: authReducer,
  cart: cartReducer,
  formData: formDataReducer,

  panelStack: panelStackReducer,
  panels: combineReducers({
    loginPanel: loginPanelReducer,
  }),
});
