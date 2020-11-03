import { combineReducers } from 'redux';
import { statusReducer, cartReducer, settingsReducer, panelManagerReducer, translationsReducer } from 'shared/reducers';
import { formDataReducer, errorsReducer } from 'form/reducers';
import { donationPanelReducer }  from 'donate/reducers';

export const rootReducer = combineReducers({
  status: statusReducer,
  settings: settingsReducer,
  cart: cartReducer,
  formData: formDataReducer,
  errors: errorsReducer,
  panelManager: panelManagerReducer,
  panels: combineReducers({
    donationPanel: donationPanelReducer,
  }),
  translations: translationsReducer,
});
