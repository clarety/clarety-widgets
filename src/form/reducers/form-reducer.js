import { combineReducers } from 'redux';
import { elementsReducer } from '../../shared/reducers';
import { formStatusReducer, formErrorsReducer, formDataReducer } from '.';

const formReducer = combineReducers({
  status: formStatusReducer,
  errors: formErrorsReducer,

  elements: elementsReducer,

  formData: formDataReducer,
});

export default formReducer;
