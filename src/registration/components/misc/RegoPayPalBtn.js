import React from 'react';
import { connect } from 'react-redux';
import { PayPalBtn } from 'shared/components';
import { getSetting } from 'shared/selectors';
import { getPaymentMethod, getTotalAmount } from 'registration/selectors';
import { makePayPalPayment, validatePayPal, cancelPayPal } from 'registration/actions';

export const _RegoPayPalBtn = (props) => {
  const { paymentMethod } = props;
  if (!paymentMethod) return null;

  return (
    <PayPalBtn
      paymentMethod={paymentMethod}
      currency={props.currency}
      amount={props.amount}
      onClick={props.onPayPalClick}
      onSuccess={props.onPayPalSuccess}
      onCancel={props.onPayPalCancel}
      onError={props.onPayPalError}
      label="pay"
      noShipping
    />
  );
};

const mapStateToProps = (state, ownProps) => ({
  paymentMethod: getPaymentMethod(state, 'wallet', 'paypal'),
  currency: getSetting(state, 'currency'),
  amount: getTotalAmount(state),
});

const actions = {
  onPayPalClick: validatePayPal,
  onPayPalSuccess: makePayPalPayment,
  onPayPalCancel: cancelPayPal,
  onPayPalError: cancelPayPal,
};

export const RegoPayPalBtn = connect(mapStateToProps, actions)(_RegoPayPalBtn);
