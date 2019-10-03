import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { statusReducer, cartReducer, settingsReducer } from 'shared/reducers';
import { formDataReducer, errorsReducer } from 'form/reducers';
import { amountPanelReducer }  from 'donate/reducers';

export const createRootReducer = history => combineReducers({
  router: connectRouter(history),

  status: statusReducer,
  settings: settingsReducer,
  cart: cartReducer,
  formData: formDataReducer,
  errors: errorsReducer,

  panels: combineReducers({
    amountPanel: amountPanelReducer,
  }),
});
