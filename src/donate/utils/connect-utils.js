import { connect } from 'react-redux';
import { clearItems } from 'shared/actions';
import { formatPrice } from 'form/utils';
import { submitDetailsPanel, submitPaymentPanel } from 'donate/actions';
import { getSetting } from 'shared/selectors';
import { getIsBusy, getSelectedFrequency, getSelectedAmount, getFrequencyLabel } from 'donate/selectors';
import { selectAmount, submitDonationPanel } from 'donate/actions';

export function connectDonationPanel(ViewComponent) {
  const mapStateToProps = state => {
    const { donationPanel } = state.panels;
  
    return {
      offers: state.settings.priceHandles,
      frequency: donationPanel.frequency,
      selections: donationPanel.selections,
      selectedAmount: getSelectedAmount(state),
      errors: state.errors,
      forceMd: getSetting(state, 'forceMdLayout'),
      variant: getSetting(state, 'variant'),
    };
  };
  
  const actions = {
    selectAmount: selectAmount,
    submitDonationPanel: submitDonationPanel,
    clearItems: clearItems,
  };
  
  return connect(mapStateToProps, actions)(ViewComponent);
}

export function connectDetailsPanel(ViewComponent) {
  const mapStateToProps = state => {
    return {
      isBusy: getIsBusy(state),
      errors: state.errors,
      forceMd: getSetting(state, 'forceMdLayout'),
      variant: getSetting(state, 'variant'),
    };
  };
  
  const actions = {
    onSubmit: submitDetailsPanel,
  };
  
  return connect(mapStateToProps, actions)(ViewComponent);
}

export function connectFundraisingPanel(ViewComponent) {
  const mapStateToProps = state => {
    return {
      isBusy: getIsBusy(state),
      errors: state.errors,
      forceMd: getSetting(state, 'forceMdLayout'),
      variant: getSetting(state, 'variant'),
    };
  };
  
  const actions = {
  };
  
  return connect(mapStateToProps, actions)(ViewComponent);
}

export function connectPaymentPanel(ViewComponent) {
  const mapStateToProps = state => {
    return {
      isBusy: getIsBusy(state),
      amount: getSelectedAmount(state),
      frequency: getSelectedFrequency(state),
      formData: state.formData,
      errors: state.errors,
      forceMd: getSetting(state, 'forceMdLayout'),
      variant: getSetting(state, 'variant'),
    };
  };
  
  const actions = {
    onSubmit: submitPaymentPanel,
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
      },
      forceMd: getSetting(state, 'forceMdLayout'),
      variant: getSetting(state, 'variant'),
    };
  };

  return connect(mapStateToProps)(ViewComponent);
}
