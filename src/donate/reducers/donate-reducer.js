import { combineReducers } from 'redux';
import { formStatusReducer, formErrorsReducer, formDataReducer } from '../../form/reducers';
import { currencyReducer, elementsReducer, saleReducer } from '../../shared/reducers';
import { donationOffersReducer, amountPanelReducer, paymentPanelReducer }  from '.';

const donateReducer = combineReducers({
  status: formStatusReducer,
  errors: formErrorsReducer,

  currency: currencyReducer,
  elements: elementsReducer,
  donationOffers: donationOffersReducer,

  formData: formDataReducer,
  sale: saleReducer,

  amountPanel: amountPanelReducer,
  paymentPanel: paymentPanelReducer,
});

export default donateReducer;
