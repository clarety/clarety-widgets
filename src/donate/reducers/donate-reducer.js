import { combineReducers } from 'redux';
import { formDataReducer, errorsReducer, paymentDataReducer } from '../../form/reducers';
import { statusReducer, saleReducer, explainReducer } from 'shared/reducers';
import { jwtReducer, successPanelReducer, amountPanelReducer }  from '.';

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
