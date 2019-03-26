import { combineReducers } from 'redux';
import elementsReducer from '../../shared/reducers/elements-reducer';
import formStatusReducer from './form-status-reducer';
import formDataReducer from './form-data-reducer';
import formErrorsReducer from './form-errors-reducer';


const formReducer = combineReducers({
  elements: elementsReducer,
  status: formStatusReducer,
  data: formDataReducer,
  errors: formErrorsReducer,
});

export default formReducer;
