import { combineReducers } from 'redux';
import elementsReducer from '../../shared/reducers/elements-reducer';
import suggestedDonationsReducer from './suggested-donations-reducer';

const donateReducer = combineReducers({
  elements: elementsReducer,
  suggestedDonations: suggestedDonationsReducer,
});

export default donateReducer;
