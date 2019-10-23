import { makePayment } from 'registration/actions';
import { getCart } from 'registration/selectors';

export class PaymentConnect {
  static mapStateToProps = (state, ownProps) => {
    return {
      isBusy: state.status === 'busy',
      errors: state.errors,
      paymentMethod: { type: 'gatewaycc' },
      submitBtnTitle: 'Submit Registration',
      cart: getCart(state),
    };
  };
  
  static actions = {
    onShowPanel: () => ({ type: 'NO_OP' }),
    makePayment: makePayment,
  };
}
