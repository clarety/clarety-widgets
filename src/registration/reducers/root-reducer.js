import { combineReducers } from 'redux';
import { statusReducer, authReducer, panelManagerReducer } from 'shared/reducers';
import { formDataReducer, errorsReducer } from 'form/reducers';
import { amountPanelReducer } from 'donate/reducers';
import { settingsReducer, cartReducer, participantsReducer, teamsReducer } from 'registration/reducers';

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

  panels: combineReducers({
    amountPanel: amountPanelReducer,
  }),
});
