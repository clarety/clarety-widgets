import { combineReducers } from 'redux';
import { statusReducer, saleReducer, explainReducer } from 'shared/reducers';
import { formDataReducer, errorsReducer, paymentDataReducer } from 'form/reducers';
import { jwtReducer, successPanelReducer, amountPanelReducer }  from 'donate/reducers';

export const donateReducer = combineReducers({
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
