import { fetchPaymentMethods, makePayment } from 'checkout/actions';
import { getPaymentMethod } from 'checkout/selectors';

export class PaymentConnect {
  static mapStateToProps = (state, ownProps) => {
    return {
      isBusy: state.status === 'busy',
      errors: state.errors,
      paymentMethod: getPaymentMethod(state),
    };
  };

  static actions = {
      onShowPanel: fetchPaymentMethods,
      makePayment: makePayment,
  };
}
