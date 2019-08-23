import { combineReducers } from 'redux';
import * as reducers from 'checkout/reducers';

export const rootReducer = combineReducers({
  status:   reducers.statusReducer,
  panels:   reducers.panelsReducer,
  cart:     reducers.cartReducer,
  formData: reducers.formDataReducer,
  errors:   reducers.errorsReducer,
});
