import { combineReducers } from 'redux';
import { panelsReducer, dataReducer } from '.';

export const rootReducer = combineReducers({
  panels: panelsReducer,
  data: dataReducer,
});
