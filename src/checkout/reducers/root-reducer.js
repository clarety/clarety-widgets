import { combineReducers } from 'redux';
import { authReducer } from 'shared/reducers';
import * as reducers from 'checkout/reducers';

export const rootReducer = combineReducers({
  status:   reducers.statusReducer,
  panels:   reducers.panelsReducer,
  auth:              authReducer,
  cart:     reducers.cartReducer,
  formData: reducers.formDataReducer,
  errors:   reducers.errorsReducer,
});
