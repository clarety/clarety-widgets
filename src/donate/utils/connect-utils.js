import React from 'react';
import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { Provider, connect } from 'react-redux';
import { statuses, setStatus, setExplain, addSaleline, clearSalelines, setPayment } from 'shared/actions';
import { updateFormData, setErrors, clearErrors } from 'form/actions';
import { formatPrice } from 'form/utils';
import { donateReducer } from '../reducers';
import { selectDefaults, selectAmount, setSuccessResult } from '../actions';

export function connectDonateWidget(ViewComponent) {
  const mapStateToProps = state => {
    return {
      status: state.status,
    };
  };

  const actions = {
    setStatus: setStatus,
    setExplain: setExplain,
    updateFormData: updateFormData,
    selectDefaults: selectDefaults,
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
    setStatus: setStatus,
    
    addSaleline: addSaleline,
    clearSalelines: clearSalelines,
  
    setErrors: setErrors,
    clearErrors: clearErrors,
    
    selectAmount: selectAmount,
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
    setStatus: setStatus,
    setErrors: setErrors,
    clearErrors: clearErrors,
    updateFormData: updateFormData,
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
    setStatus: setStatus,
  
    setErrors: setErrors,
    clearErrors: clearErrors,
  
    setPayment: setPayment,
    setSuccessResult: setSuccessResult,
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
