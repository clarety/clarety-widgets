import { combineReducers } from 'redux';
import * as reducers from 'checkout/reducers';

export const rootReducer = combineReducers({
  status:   reducers.statusReducer,
  panels:   reducers.panelsReducer,
  login:    reducers.loginReducer,
  checkout: reducers.checkoutReducer,
  formData: reducers.formDataReducer,
});
