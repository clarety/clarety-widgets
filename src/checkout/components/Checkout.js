import React from 'react';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { panels, setPanels, fetchCart } from 'checkout/actions';
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

export class Checkout extends React.Component {
  componentDidMount() {
    store.dispatch(fetchCart());
  }

  render() {
    return (
      <Provider store={store}>
        <PanelStack />
      </Provider>
    );
  }
}
