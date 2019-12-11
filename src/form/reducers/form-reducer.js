import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { settingsReducer, statusReducer } from 'shared/reducers';
import { errorsReducer, formDataReducer } from 'form/reducers';

export const createFormReducer = history => combineReducers({
  router: connectRouter(history),
  status: statusReducer,
  errors: errorsReducer,
  settings: settingsReducer,
  formData: formDataReducer,
});
