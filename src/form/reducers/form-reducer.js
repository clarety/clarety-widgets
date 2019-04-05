import { combineReducers } from 'redux';
import { elementsReducer, statusReducer } from '../../shared/reducers';
import { formErrorsReducer, formDataReducer } from '.';

const formReducer = combineReducers({
  status: statusReducer,
  errors: formErrorsReducer,

  elements: elementsReducer,

  formData: formDataReducer,
});

export default formReducer;
