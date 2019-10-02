import { combineReducers } from 'redux';
import { authReducer, panelManagerReducer } from 'shared/reducers';
import { formDataReducer } from 'form/reducers';
import { statusReducer, errorsReducer, cartReducer } from 'checkout/reducers';

export const rootReducer = combineReducers({
  status: statusReducer,
  errors: errorsReducer,

  auth: authReducer,
  cart: cartReducer,
  formData: formDataReducer,

  panelManager: panelManagerReducer,
});
