import { combineReducers } from 'redux';
import { authReducer } from 'shared/reducers';
import { formDataReducer } from 'form/reducers';
import * as reducers from 'checkout/reducers';

export const rootReducer = combineReducers({
  status:   reducers.statusReducer,
  panels:   reducers.panelsReducer,
  auth:              authReducer,
  cart:     reducers.cartReducer,
  formData:          formDataReducer,
  errors:   reducers.errorsReducer,
});
