import { getSetting, getCart } from 'shared/selectors';
import { getFormData, getErrors } from 'form/selectors';
import { setErrors, updateFormData } from 'form/actions';
import { fetchPaymentMethods, makePayment } from 'checkout/actions';
import { getPaymentMethods } from 'checkout/selectors';

export class PaymentConnect {
  static mapStateToProps = (state, ownProps) => {
    const cart = getCart(state);

    // 'wallet' types are for express checkout, ignore them on the payment panel.
    const paymentMethods = getPaymentMethods(state).filter(pm => pm.type !== 'wallet');

    return {
      isBusy: state.status === 'busy',
      paymentMethods: paymentMethods,
      currency: cart.currency.code,
      amount: cart.summary.total,
      formData: getFormData(state),
      errors: getErrors(state),
      variant: getSetting(state, 'variant'),
    };
  };

  static actions = {
    onShowPanel: fetchPaymentMethods,
    onSubmit: makePayment,
    updateFormData: updateFormData,
    setErrors: setErrors,
  };
}
