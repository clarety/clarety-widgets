import { combineReducers } from 'redux';
import { statusReducer, settingsReducer } from 'shared/reducers';
import { formDataReducer, errorsReducer } from 'form/reducers';

export const rootReducer = combineReducers({
  status: statusReducer,
  settings: settingsReducer,
  errors: settingsReducer,
  formData: formDataReducer,
  errors: errorsReducer,
});
