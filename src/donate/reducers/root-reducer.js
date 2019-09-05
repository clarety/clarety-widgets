import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { statusReducer, saleReducer, explainReducer } from 'shared/reducers';
import { formDataReducer, errorsReducer } from 'form/reducers';
import { successPanelReducer, amountPanelReducer }  from 'donate/reducers';

export const createRootReducer = history => combineReducers({
  router: connectRouter(history),

  status: statusReducer,
  settings: explainReducer,
  cart: saleReducer,
  formData: formDataReducer,
  errors: errorsReducer,

  panels: combineReducers({
    amountPanel: amountPanelReducer,
    successPanel: successPanelReducer,
  }),
});
