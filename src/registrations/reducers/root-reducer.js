import { combineReducers } from 'redux';
import * as reducers from 'registrations/reducers';

export const rootReducer = combineReducers({
  status:     reducers.statusReducer,
  settings:   reducers.settingsReducer,
  cart:       reducers.cartReducer,
  panelStack: reducers.panelStackReducer,
  panelData:  reducers.panelDataReducer,
});
