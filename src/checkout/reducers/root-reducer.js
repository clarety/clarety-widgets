import { combineReducers } from 'redux';
import { panelsReducer, dataReducer, cartReducer } from '.';

export const rootReducer = combineReducers({
  panels: panelsReducer,
  data: dataReducer,
  cart: cartReducer,
});
