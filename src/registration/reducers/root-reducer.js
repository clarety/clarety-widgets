import { combineReducers } from 'redux';
import { authReducer, panelManagerReducer, translationsReducer } from 'shared/reducers';
import { formDataReducer, errorsReducer } from 'form/reducers';
import { statusReducer, settingsReducer, cartReducer, participantsReducer, teamsReducer } from 'registration/reducers';

export const rootReducer = combineReducers({
  status: statusReducer,
  settings: settingsReducer,
  auth: authReducer,
  cart: cartReducer,
  formData: formDataReducer,
  errors: errorsReducer,
  panelManager: panelManagerReducer,
  participants: participantsReducer,
  teams: teamsReducer,
  translations: translationsReducer,
});
