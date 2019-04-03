import { combineReducers } from 'redux';
import { elementsReducer } from '../../shared/reducers';
import { formStatusReducer, formErrorsReducer, formDataReducer } from '.';

const formReducer = combineReducers({
  elements: elementsReducer,
  status: formStatusReducer,
  data: formDataReducer,
  errors: formErrorsReducer,
});

export default formReducer;
