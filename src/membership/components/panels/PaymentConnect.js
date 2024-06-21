import { getSetting, getCart } from 'shared/selectors';
import { getFormData, getErrors } from 'form/selectors';
import { updateFormData, setErrors } from 'form/actions';
import { getIsBusy, getPaymentMethods } from 'donate/selectors';
import { cancelPaymentAuthorise } from 'donate/actions';
import { makePayment } from 'membership/actions';

export class PaymentConnect {
  static mapStateToProps = (state, ownProps) => {
    const cart = getCart(state);
    const cartTotal = cart.items.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);

    // 'wallet' types are for express donations, ignore them on the payment panel.
    const paymentMethods = getPaymentMethods(state).filter(pm => pm.type !== 'wallet');

    return {
      isBusy: getIsBusy(state),
      amount: cartTotal,
      paymentMethods: paymentMethods,
      cartStatus: cart.status,
      authSecret: cart.authSecret,
      formData: getFormData(state),
      errors: getErrors(state),
      variant: getSetting(state, 'variant'),
    };
  };

  static actions = {
    onShowPanel: () => async () => true,
    onSubmit: makePayment,
    cancelPaymentAuthorise: cancelPaymentAuthorise,
    updateFormData: updateFormData,
    setErrors: setErrors,
  };
}
