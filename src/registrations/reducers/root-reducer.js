import { combineReducers } from 'redux';
import { statusReducer, authReducer, panelManagerReducer } from 'shared/reducers';
import { formDataReducer, errorsReducer } from 'form/reducers';
import { amountPanelReducer } from 'donate/reducers';
import { settingsReducer, cartReducer, panelDataReducer, teamPanelReducer } from 'registrations/reducers';

export const rootReducer = combineReducers({
  status:     statusReducer,
  settings:   settingsReducer,
  auth:       authReducer,
  cart:       cartReducer,
  formData:   formDataReducer,
  errors:     errorsReducer,

  panelManager: panelManagerReducer,
  panelData:    panelDataReducer,

  panels: combineReducers({
    amountPanel: amountPanelReducer,
    teamPanel:   teamPanelReducer,
  }),
});
