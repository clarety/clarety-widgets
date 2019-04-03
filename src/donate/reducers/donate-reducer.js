import { combineReducers } from 'redux';
import { formStatusReducer, formErrorsReducer, formDataReducer } from '../../form/reducers';
import { currencyReducer, elementsReducer, saleReducer } from '../../shared/reducers';
import { donationOffersReducer, amountPanelReducer }  from '.';

const donateReducer = combineReducers({
  status: formStatusReducer,
  errors: formErrorsReducer,

  currency: currencyReducer,
  elements: elementsReducer,
  donationOffers: donationOffersReducer,

  data: formDataReducer,
  sale: saleReducer,

  amountPanel: amountPanelReducer,
});

export default donateReducer;
