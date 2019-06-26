import React from 'react';
import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { Provider, connect } from 'react-redux';
import donateReducer from '../reducers/donate-reducer';
import * as sharedActions from '../../shared/actions';
import { statuses } from '../../shared/actions';
import * as formActions from '../../form/actions';
import * as donateActions from '../actions';
import { formatPrice } from '../../form/utils/payment-utils';

export function connectDonateWidget(ViewComponent) {
  const mapStateToProps = state => {
    return {
      status: state.status,
    };
  };

  const actions = {
    setStatus: sharedActions.setStatus,
    setExplain: sharedActions.setExplain,
    updateFormData: formActions.updateFormData,
    selectDefaults: donateActions.selectDefaults,
  };

  const ConnectedComponent = connect(mapStateToProps, actions)(ViewComponent);

  const composeDevTools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const store = createStore(donateReducer, composeDevTools(applyMiddleware(thunkMiddleware)));
  if (window.Cypress) window.store = store;

  class StoreWrapper extends React.Component {
    render() {
      return (
        <Provider store={store}>
          <ConnectedComponent {...this.props} />
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
      status: state.status,
  
      offers: state.explain.offers,
  
      frequency: amountPanel.frequency,
      selections: amountPanel.selections,
    };
  };
  
  const actions = {
    setStatus: sharedActions.setStatus,
    
    addSaleline: sharedActions.addSaleline,
    clearSalelines: sharedActions.clearSalelines,
  
    setErrors: formActions.setErrors,
    clearErrors: formActions.clearErrors,
    
    selectAmount: donateActions.selectAmount,
  };

  return connect(mapStateToProps, actions)(ViewComponent);
}

export function connectDetailsPanel(ViewComponent) {
  const mapStateToProps = state => {
    return {
      status: state.status,
      formData: state.formData,
      saleline: getSaleline(state),
      isBusy: getIsBusy(state),
    };
  };
  
  const actions = {
    setStatus: sharedActions.setStatus,
    setErrors: formActions.setErrors,
    clearErrors: formActions.clearErrors,
    updateFormData: formActions.updateFormData,
  };
  
  return connect(mapStateToProps, actions)(ViewComponent);
}

export function connectPaymentPanel(ViewComponent) {
  const mapStateToProps = state => {
    const saleline = getSaleline(state);

    return {
      status: state.status,
      isBusy: getIsBusy(state),

      amount: formatPrice(saleline.price),

      jwt: state.jwt,
      stripeKey: state.explain.payment.publicKey,

      paymentData: state.paymentData,
      formData: state.formData,

      saleline: saleline,
      payment: state.sale.payment,
    };
  };
  
  const actions = {
    setStatus: sharedActions.setStatus,
  
    setErrors: formActions.setErrors,
    clearErrors: formActions.clearErrors,
  
    setPayment: sharedActions.setPayment,
    setSuccessResult: donateActions.setSuccessResult,
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
  return state.sale.salelines[0];
}

function getFrequencyLabel(state, offerUid) {
  for (let offer of state.explain.offers) {
    if (offer.offerUid === offerUid) return offer.label;
  }

  return '';
}
