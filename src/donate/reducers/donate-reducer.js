import { combineReducers } from 'redux';
import { formStatusReducer, formErrorsReducer } from '../../form/reducers';
import { currencyReducer, elementsReducer, saleReducer } from '../../shared/reducers';
import { donationOffersReducer, amountPanelReducer }  from '.';

const donateReducer = combineReducers({
  status: formStatusReducer,
  errors: formErrorsReducer,
  sale: saleReducer,

  currency: currencyReducer,
  elements: elementsReducer,
  donationOffers: donationOffersReducer,

  amountPanel: amountPanelReducer,
});

export default donateReducer;
