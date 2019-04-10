import { combineReducers } from 'redux';
import { formDataReducer, errorsReducer, paymentDataReducer } from '../../form/reducers';
import { statusReducer, saleReducer, explainReducer } from '../../shared/reducers';
import { jwtReducer, successPanelReducer, amountPanelReducer }  from '.';

const donateReducer = combineReducers({
  status: statusReducer,
  errors: errorsReducer,

  explain: explainReducer,

  jwt: jwtReducer,
  formData: formDataReducer,
  sale: saleReducer,

  panels: combineReducers({
    amountPanel: amountPanelReducer,
    paymentPanel: paymentDataReducer,
    successPanel: successPanelReducer,
  }),
});

export default donateReducer;
