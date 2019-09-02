import { combineReducers } from 'redux';
import * as reducers from 'registrations/reducers';

export const rootReducer = combineReducers({
  status:    reducers.statusReducer,
  settings:  reducers.settingsReducer,
  panels:    reducers.panelsReducer,
  formData:  reducers.formDataReducer,
  cart:      reducers.cartReducer,
  errors:    reducers.errorsReducer,
});
