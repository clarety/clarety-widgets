import { combineReducers } from 'redux';
import { formDataReducer, formErrorsReducer, paymentDataReducer } from '../../form/reducers';
import { statusReducer, saleReducer, explainReducer } from '../../shared/reducers';
import { successPanelReducer, amountPanelReducer }  from '.';

const donateReducer = combineReducers({
  status: statusReducer,
  errors: formErrorsReducer,

  explain: explainReducer,

  formData: formDataReducer,
  sale: saleReducer,

  amountPanel: amountPanelReducer,
  paymentPanel: paymentDataReducer,
  successPanel: successPanelReducer,
});

export default donateReducer;
