import { makePayment } from 'registration/actions';
import { getCart, getPaymentMethod } from 'registration/selectors';

export class PaymentConnect {
  static mapStateToProps = (state, ownProps) => {
    const paymentMethod = getPaymentMethod(state);

    return {
      isBusy: state.status === 'busy',
      errors: state.errors,
      paymentMethod: paymentMethod,
      submitBtnTitle: 'Submit Registration',
      cart: getCart(state),
    };
  };
  
  static actions = {
    onShowPanel: () => ({ type: 'NO_OP' }),
    makePayment: makePayment,
  };
}
