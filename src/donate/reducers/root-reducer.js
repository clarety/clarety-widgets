import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { statusReducer, saleReducer, explainReducer } from 'shared/reducers';
import { formDataReducer, errorsReducer, paymentDataReducer } from 'form/reducers';
import { successPanelReducer, amountPanelReducer }  from 'donate/reducers';

export const createRootReducer = history => combineReducers({
  router: connectRouter(history),

  status: statusReducer,
  errors: errorsReducer,

  explain: explainReducer,

  sale: saleReducer,

  formData: formDataReducer,
  paymentData: paymentDataReducer,

  panels: combineReducers({
    amountPanel: amountPanelReducer,
    successPanel: successPanelReducer,
  }),
});
