import { combineReducers } from 'redux';
import { explainReducer, statusReducer } from '../../shared/reducers';
import { errorsReducer, formDataReducer } from '.';

const formReducer = combineReducers({
  status: statusReducer,
  errors: errorsReducer,
  explain: explainReducer,
  formData: formDataReducer,
});

export default formReducer;
