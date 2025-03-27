import { combineReducers } from 'redux';
import { statusReducer, cartReducer, settingsReducer, panelManagerReducer } from 'shared/reducers';
import { formDataReducer, errorsReducer } from 'form/reducers';
import { donationPanelReducer, rgUpsellReducer }  from 'donate/reducers';

export const rootReducer = combineReducers({
  status: statusReducer,
  settings: settingsReducer,
  cart: cartReducer,
  rgUpsell: rgUpsellReducer,
  formData: formDataReducer,
  errors: errorsReducer,
  panelManager: panelManagerReducer,
  panels: combineReducers({
    donationPanel: donationPanelReducer,
  }),
});
