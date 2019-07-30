import { combineReducers } from 'redux';
import { panelsReducer } from '.';

export const rootReducer = combineReducers({
  panels: panelsReducer,
});
