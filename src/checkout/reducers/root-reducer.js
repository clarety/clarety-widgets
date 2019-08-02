import { combineReducers } from 'redux';
import { panelsReducer, dataReducer, cartReducer, loginReducer } from '.';

export const rootReducer = combineReducers({
  panels: panelsReducer,
  data: dataReducer,
  cart: cartReducer,
  login: loginReducer,
});
