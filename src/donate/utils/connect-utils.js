import React from 'react';
import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { routerMiddleware } from 'connected-react-router';
import { Provider as ReduxProvider, connect } from 'react-redux';
import { createMemoryHistory } from 'history';
import { OverrideContext } from 'shared/utils';
import { clearItems } from 'shared/actions';
import { formatPrice } from 'form/utils';
import { createRootReducer } from 'donate/reducers';
import { selectAmount, submitAmountPanel, submitDetailsPanel, submitPaymentPanel } from 'donate/actions';
import { getIsBusy, getSelectedFrequency, getSelectedAmount, getFrequencyLabel } from 'donate/selectors';
import { DonateWidget, DonatePage } from 'donate/components';
import { Actions, PageActions } from 'donate/actions';
import { Validations } from 'donate/validations';

function wrapDonateComponent(Component, { components, actions, validations }) {
  components = components || {};
  actions = actions || new Actions;
  validations = validations || new Validations;

  // Setup redux store.
  const history = createMemoryHistory();
  const reducer = createRootReducer(history);

  const thunk = thunkMiddleware.withExtraArgument({ actions, validations });
  const middleware = applyMiddleware(routerMiddleware(history), thunk);

  const composeDevTools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  const store = createStore(reducer, composeDevTools(middleware));

  // Wrap donation widget in providers.
  const DonateWrapper = props => (
    <ReduxProvider store={store}>
      <OverrideContext.Provider value={components}>
        <Component {...props} history={history} />
      </OverrideContext.Provider>
    </ReduxProvider>
  );

  return DonateWrapper;
}

export function createDonateWidget({ components, actions, validations } = {}) {
  components = components || {};
  actions = actions || new Actions;
  validations = validations || new Validations;

  return wrapDonateComponent(DonateWidget, { components, actions, validations });
}

export function createDonatePage({ components, actions, validations } = {}) {
  components = components || {};
  actions = actions || new PageActions;
  validations = validations || new Validations;

  return wrapDonateComponent(DonatePage, { components, actions, validations });
}

export function connectAmountPanel(ViewComponent) {
  const mapStateToProps = state => {
    const { amountPanel } = state.panels;
  
    return {
      offers: state.settings.offers,
      frequency: amountPanel.frequency,
      selections: amountPanel.selections,
      selectedAmount: getSelectedAmount(state),
      errors: state.errors,
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
      errors: state.errors,
    };
  };
  
  const actions = {
    submitDetailsPanel: submitDetailsPanel,
  };
  
  return connect(mapStateToProps, actions)(ViewComponent);
}

export function connectPaymentPanel(ViewComponent) {
  const mapStateToProps = state => {
    return {
      isBusy: getIsBusy(state),
      amount: getSelectedAmount(state),
      frequency: getSelectedFrequency(state),
      errors: state.errors,
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
