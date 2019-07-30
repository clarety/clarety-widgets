import React from 'react';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { panels, setPanels } from 'checkout/actions';
import { rootReducer } from 'checkout/reducers';
import { PanelStack } from 'checkout/components';

const composeDevTools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer, composeDevTools(applyMiddleware(thunkMiddleware)));

store.dispatch(
  setPanels([
    panels.contactDetailsPanel,
    panels.personalDetailsPanel,
    panels.shippingDetailsPanel,
    panels.shippingOptionsPanel,
    panels.paymentDetailsPanel,
  ])
);

export const Checkout = () => (
  <Provider store={store}>
    <PanelStack />
  </Provider>
);
