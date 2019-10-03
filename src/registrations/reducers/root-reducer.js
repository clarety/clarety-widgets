import { combineReducers } from 'redux';
import { statusReducer, panelManagerReducer } from 'shared/reducers';
import { formDataReducer, errorsReducer } from 'form/reducers';
import { amountPanelReducer } from 'donate/reducers';
import { settingsReducer, cartReducer, panelDataReducer, teamPanelReducer } from 'registrations/reducers';

export const rootReducer = combineReducers({
  status:     statusReducer,
  settings:   settingsReducer,
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
