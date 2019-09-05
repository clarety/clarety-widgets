import React from 'react';
import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { routerMiddleware } from 'connected-react-router';
import { Provider, connect } from 'react-redux';
import { createMemoryHistory } from 'history';
import { statuses, fetchExplain, clearSalelines } from 'shared/actions';
import { updateFormData } from 'form/actions';
import { formatPrice } from 'form/utils';
import { createRootReducer } from 'donate/reducers';
import { selectAmount, submitAmountPanel, submitDetailsPanel, submitPaymentPanel } from 'donate/actions';

export function connectDonateWidget(ViewComponent) {
  const mapStateToProps = state => {
    return {
      status: state.status,
    };
  };

  const actions = {
    fetchExplain: fetchExplain,
    updateFormData: updateFormData,
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
    };
  };
  
  const actions = {
    selectAmount: selectAmount,
    submitAmountPanel: submitAmountPanel,
    clearSalelines: clearSalelines,
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
    const saleline = getSaleline(state);

    return {
      isBusy: getIsBusy(state),
      amount: formatPrice(saleline.price),
    };
  };
  
  const actions = {
    submitPaymentPanel: submitPaymentPanel,
  };

  return connect(mapStateToProps, actions)(ViewComponent);
}

export function connectSuccessPanel(ViewComponent) {
  const mapStateToProps = state => {
    const result = state.panels.successPanel.result;
    const saleline = result.salelines[0];

    return {
      result,
      customer : result.customer,
      donation: {
        frequency: getFrequencyLabel(state, saleline.offerUid),
        amount: formatPrice(saleline.price),
      }
    };
  };

  return connect(mapStateToProps)(ViewComponent);
}


// Selectors

function getIsBusy(state) {
  return state.status !== statuses.ready;
}

function getSaleline(state) {
  return state.cart.salelines[0];
}

function getFrequencyLabel(state, offerUid) {
  for (let offer of state.settings.offers) {
    if (offer.offerUid === offerUid) return offer.label;
  }

  return '';
}
