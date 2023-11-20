import React from 'react';
import { connect } from 'react-redux';
import { PayPalBtn } from 'shared/components';
import { getSetting } from 'shared/selectors';
import { getPaymentMethod, getDonationPanelSelection, getSelectedFrequency } from 'donate/selectors';
import { makePayPalPayment, validatePayPal, cancelPayPal } from 'donate/actions';

export function _DonatePayPalBtn(props) {
  const { paymentMethod, frequency, onShowBtn } = props;

  const [isShowing, setIsShowing] = React.useState(false);

  React.useEffect(() => {
    function shouldShow() {
      // Check if btn should display.
      if (!paymentMethod) return false;
      if (paymentMethod.singleOnly && frequency !== 'single') return false;
      if (paymentMethod.recurringOnly && frequency !== 'recurring') return false;
      return true;
    }

    if (shouldShow()) {
      if (onShowBtn) onShowBtn();
      setIsShowing(true);
    }
  }, [paymentMethod, frequency]);

  if (!isShowing) {
    return null;
  }

  return (
    <PayPalBtn
      paymentMethod={props.paymentMethod}
      currency={props.currency}
      amount={props.amount}
      onClick={props.onPayPalClick}
      onSuccess={props.onPayPalSuccess}
      onCancel={props.onPayPalCancel}
      onError={props.onPayPalError}
    />
  );
};

const mapStateToProps = (state, ownProps) => ({
  paymentMethod: getPaymentMethod(state, 'wallet', 'paypal'),
  currency: getSetting(state, 'currency'),
  amount: getDonationPanelSelection(state).amount,
  frequency: getSelectedFrequency(state),
});

const actions = {
  onPayPalClick: validatePayPal,
  onPayPalSuccess: makePayPalPayment,
  onPayPalCancel: cancelPayPal,
  onPayPalError: cancelPayPal,
};

export const DonatePayPalBtn = connect(mapStateToProps, actions)(_DonatePayPalBtn);
