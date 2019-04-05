import { combineReducers } from 'redux';
import { formErrorsReducer, formDataReducer, paymentDataReducer } from '../../form/reducers';
import { statusReducer, currencyReducer, elementsReducer, saleReducer } from '../../shared/reducers';
import { donationOffersReducer, amountPanelReducer }  from '.';

const donateReducer = combineReducers({
  status: statusReducer,
  errors: formErrorsReducer,

  currency: currencyReducer,
  elements: elementsReducer,
  donationOffers: donationOffersReducer,

  formData: formDataReducer,
  sale: saleReducer,

  amountPanel: amountPanelReducer,
  paymentPanel: paymentDataReducer,
});

export default donateReducer;
