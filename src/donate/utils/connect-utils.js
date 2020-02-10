import { connect } from 'react-redux';
import { formatPrice } from 'form/utils';
import { submitPaymentPanel } from 'donate/actions';
import { getSetting } from 'shared/selectors';
import { getIsBusy, getSelectedFrequency, getSelectedAmount, getFrequencyLabel } from 'donate/selectors';

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
