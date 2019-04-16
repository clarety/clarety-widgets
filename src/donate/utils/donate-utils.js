import React from 'react';
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';
import donateReducer from '../reducers/donate-reducer';
import * as sharedActions from '../../shared/actions';
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

  class StoreWrapper extends React.Component {
    render() {
      const store = createStore(donateReducer);
      if (window.Cypress) window.store = store;

      return (
        <Provider store={store}>
          <ConnectedComponent { ...this.props } />
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
  
      donationOffers: state.explain.donationOffers,
  
      frequency: amountPanel.frequency,
      selections: amountPanel.selections,
    };
  };
  
  const actions = {
    setStatus: sharedActions.setStatus,
    
    addSaleLine: sharedActions.addSaleLine,
    clearSaleLines: sharedActions.clearSaleLines,
  
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
      jwt: state.jwt,
      formData: state.formData,
      saleLines: state.sale.saleLines,
      donation: state.panels.successPanel.donation,
    };
  };
  
  const actions = {
    setStatus: sharedActions.setStatus,
    setErrors: formActions.setErrors,
    clearErrors: formActions.clearErrors,
    updateFormData: formActions.updateFormData,
    setDonation: donateActions.setDonation,
    setJwt: donateActions.setJwt,
  };
  
  return connect(mapStateToProps, actions)(ViewComponent);
}

export function connectPaymentPanel(ViewComponent) {
  const mapStateToProps = state => {
    return {
      status: state.status,

      amount: formatPrice(state.sale.saleLines[0].amount),

      jwt: state.jwt,
      stripeKey: state.explain.stripePublishableKey,

      paymentData: state.paymentData,
      formData: state.formData,

      saleLines: state.sale.saleLines,
      payment: state.sale.payment,
  
      donation: state.panels.successPanel.donation,
    };
  };
  
  const actions = {
    setStatus: sharedActions.setStatus,
  
    setErrors: formActions.setErrors,
    clearErrors: formActions.clearErrors,
  
    setPayment: sharedActions.setPayment,
    setDonation: donateActions.setDonation,
  };

  return connect(mapStateToProps, actions)(ViewComponent);
}

export function connectSuccessPanel(ViewComponent) {
  const mapStateToProps = state => {
    return {
      donation: state.panels.successPanel.donation,
    };
  };

  return connect(mapStateToProps)(ViewComponent);
}
