import { combineReducers } from 'redux';
import elementsReducer from './elementsReducer';
import formStatusReducer from './formStatusReducer';
import formDataReducer from './formDataReducer';
import formErrorsReducer from './formErrorsReducer';


const formReducer = combineReducers({
  elements: elementsReducer,
  status: formStatusReducer,
  data: formDataReducer,
  errors: formErrorsReducer,
});

export default formReducer;
