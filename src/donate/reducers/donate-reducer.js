import { combineReducers } from 'redux';
import { formErrorsReducer, formDataReducer, paymentDataReducer } from '../../form/reducers';
import { statusReducer, currencyReducer, elementsReducer, saleReducer } from '../../shared/reducers';
import { donationReducer, donationOffersReducer, amountPanelReducer }  from '.';

const donateReducer = combineReducers({
  status: statusReducer,
  errors: formErrorsReducer,

  currency: currencyReducer,
  elements: elementsReducer,
  donationOffers: donationOffersReducer,

  formData: formDataReducer,
  sale: saleReducer,
  donation: donationReducer,

  amountPanel: amountPanelReducer,
  paymentPanel: paymentDataReducer,
});

export default donateReducer;
