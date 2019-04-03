import { combineReducers } from 'redux';
import formStatusReducer from '../../form/reducers/form-status-reducer';
import formErrorsReducer from '../../form/reducers/form-errors-reducer';
import saleReducer from '../../shared/reducers/sale-reducer';
import currencyReducer from '../../shared/reducers/currency-reducer';
import elementsReducer from '../../shared/reducers/elements-reducer';
import donationOffersReducer from './donation-offers-reducer';
import amountPanelReducer from './amount-panel-reducer';

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
