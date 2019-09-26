import { combineReducers } from 'redux';
import { panelManagerReducer } from 'shared/reducers';
import { formDataReducer, errorsReducer } from 'form/reducers';
import { amountPanelReducer } from 'donate/reducers';
import * as reducers from 'registrations/reducers';

export const rootReducer = combineReducers({
  status:     reducers.statusReducer,
  settings:   reducers.settingsReducer,
  cart:       reducers.cartReducer,
  formData:   formDataReducer,
  errors:     errorsReducer,

  panelManager: panelManagerReducer,
  panelData:    reducers.panelDataReducer,

  panels: combineReducers({
    amountPanel: amountPanelReducer,
    teamPanel:   reducers.teamPanelReducer,
  }),
});
