import { combineReducers } from 'redux';
import { panelsReducer, formDataReducer, cartReducer, loginReducer } from '.';

export const rootReducer = combineReducers({
  panels: panelsReducer,
  formData: formDataReducer,
  cart: cartReducer,
  login: loginReducer,
});
