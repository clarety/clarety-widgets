import { connect } from 'react-redux';
import { PaymentPanel } from 'shared/components/panels/PaymentPanel';
import { fetchPaymentMethods, makePayment } from 'checkout/actions';
import { getPaymentMethod } from 'checkout/selectors';

const mapStateToProps = (state, ownProps) => {
  return {
    isBusy: state.status === 'busy',
    errors: state.errors,
    paymentMethod: getPaymentMethod(state),
  };
};

const actions = {
    onShowPanel: fetchPaymentMethods,
    makePayment: makePayment,
};

export const CheckoutPaymentPanel = connect(mapStateToProps, actions, null, { forwardRef: true })(PaymentPanel);
