import { combineReducers } from 'redux';
import { explainReducer, statusReducer } from '../../shared/reducers';
import { formErrorsReducer, formDataReducer } from '.';

const formReducer = combineReducers({
  status: statusReducer,
  errors: formErrorsReducer,

  explain: explainReducer,

  formData: formDataReducer,
});

export default formReducer;
