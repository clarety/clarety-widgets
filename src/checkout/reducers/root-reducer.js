import { combineReducers } from 'redux';
import { panelsReducer, loginReducer, checkoutReducer, formDataReducer } from '.';

export const rootReducer = combineReducers({
  panels:   panelsReducer,
  login:    loginReducer,
  checkout: checkoutReducer,
  formData: formDataReducer,
});
