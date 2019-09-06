import React from 'react';
import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { routerMiddleware } from 'connected-react-router';
import { Provider, connect } from 'react-redux';
import { createMemoryHistory } from 'history';
import { fetchExplain, setStore, clearItems } from 'shared/actions';
import { formatPrice } from 'form/utils';
import { createRootReducer } from 'donate/reducers';
import { selectAmount, submitAmountPanel, submitDetailsPanel, submitPaymentPanel } from 'donate/actions';
import { getIsBusy, getCartItem, getSelectedAmount, getFrequencyLabel } from 'donate/selectors';

export function connectDonateWidget(ViewComponent) {
  const mapStateToProps = state => {
    return {
      status: state.status,
    };
  };

  const actions = {
    fetchExplain: fetchExplain,
    setStore: setStore,
  };

  const ConnectedComponent = connect(mapStateToProps, actions)(ViewComponent);

  const history = createMemoryHistory();
  const middleware = applyMiddleware(routerMiddleware(history), thunkMiddleware);
  const composeDevTools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const store = createStore(createRootReducer(history), composeDevTools(middleware));

  if (window.Cypress) window.store = store;

  class StoreWrapper extends React.Component {
    render() {
      return (
        <Provider store={store}>
          <ConnectedComponent
            {...this.props}
            history={history}
          />
        </Provider>
      );
    }
  };

  StoreWrapper.displayName = `StoreWrapper(${ViewComponent.name})`;

  return StoreWrapper;
};

export function connectAmountPanel(ViewComponent) {
  const mapStateToProps = state => {
    const { amountPanel } = state.panels;
  
    return {
      offers: state.settings.offers,
      frequency: amountPanel.frequency,
      selections: amountPanel.selections,
      selectedAmount: getSelectedAmount(state),
    };
  };
  
  const actions = {
    selectAmount: selectAmount,
    submitAmountPanel: submitAmountPanel,
    clearItems: clearItems,
  };

  return connect(mapStateToProps, actions)(ViewComponent);
}

export function connectDetailsPanel(ViewComponent) {
  const mapStateToProps = state => {
    return {
      isBusy: getIsBusy(state),
    };
  };
  
  const actions = {
    submitDetailsPanel: submitDetailsPanel,
  };
  
  return connect(mapStateToProps, actions)(ViewComponent);
}

export function connectPaymentPanel(ViewComponent) {
  const mapStateToProps = state => {
    const item = getCartItem(state);

    return {
      isBusy: getIsBusy(state),
      amount: formatPrice(item.price),
    };
  };
  
  const actions = {
    submitPaymentPanel: submitPaymentPanel,
  };

  return connect(mapStateToProps, actions)(ViewComponent);
}

export function connectSuccessPanel(ViewComponent) {
  const mapStateToProps = state => {
    const { cart } = state;
    const item = cart.items[0];

    return {
      customer : cart.customer,
      donation: {
        frequency: getFrequencyLabel(state, item.offerUid),
        amount: formatPrice(item.price),
      }
    };
  };

  return connect(mapStateToProps)(ViewComponent);
}
