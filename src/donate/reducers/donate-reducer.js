import { combineReducers } from 'redux';
import elementsReducer from '../../shared/reducers/elements-reducer';
import suggestedDonationsReducer from './suggested-donations-reducer';
import amountPanelReducer from './amount-panel-reducer';

const donateReducer = combineReducers({
  elements: elementsReducer,
  suggestedDonations: suggestedDonationsReducer,
  amountPanel: amountPanelReducer,
});

export default donateReducer;
