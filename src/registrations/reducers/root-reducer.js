import { combineReducers } from 'redux';
import { formDataReducer, errorsReducer } from 'form/reducers';
import { amountPanelReducer } from 'donate/reducers';
import * as reducers from 'registrations/reducers';

export const rootReducer = combineReducers({
  status:     reducers.statusReducer,
  settings:   reducers.settingsReducer,
  cart:       reducers.cartReducer,
  formData:   formDataReducer,
  errors:     errorsReducer,

  panelStack: reducers.panelStackReducer,
  panelData:  reducers.panelDataReducer,

  panels: combineReducers({
    amountPanel: amountPanelReducer,
    teamPanel:   reducers.teamPanelReducer,
  }),
});
