import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { statusReducer, saleReducer, explainReducer } from 'shared/reducers';
import { formDataReducer, errorsReducer, paymentDataReducer } from 'form/reducers';
import { jwtReducer, successPanelReducer, amountPanelReducer }  from 'donate/reducers';

export const createDonateReducer = history => combineReducers({
  router: connectRouter(history),

  status: statusReducer,
  errors: errorsReducer,

  explain: explainReducer,

  jwt: jwtReducer,
  formData: formDataReducer,
  paymentData: paymentDataReducer,
  sale: saleReducer,

  panels: combineReducers({
    amountPanel: amountPanelReducer,
    successPanel: successPanelReducer,
  }),
});
