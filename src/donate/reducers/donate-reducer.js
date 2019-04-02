import { combineReducers } from 'redux';
import formStatusReducer from '../../form/reducers/form-status-reducer';
import formErrorsReducer from '../../form/reducers/form-errors-reducer';
import elementsReducer from '../../shared/reducers/elements-reducer';
import suggestedDonationsReducer from './suggested-donations-reducer';
import amountPanelReducer from './amount-panel-reducer';

const donateReducer = combineReducers({
  status: formStatusReducer,
  errors: formErrorsReducer,

  elements: elementsReducer,
  suggestedDonations: suggestedDonationsReducer,

  amountPanel: amountPanelReducer,
});

export default donateReducer;
