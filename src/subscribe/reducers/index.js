import { combineReducers } from 'redux';
import elementsReducer from './elementsReducer';
import formDataReducer from './formDataReducer';
import formStatusReducer from './formStatusReducer';
import validationErrorsReducer from './validationErrorsReducer';

const rootReducer = combineReducers({
  formStatus: formStatusReducer,
  formData: formDataReducer,
  elements: elementsReducer,
  validationErrors: validationErrorsReducer,
});

export default rootReducer;
