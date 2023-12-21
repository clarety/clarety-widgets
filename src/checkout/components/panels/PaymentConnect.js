import { getSetting, getCart } from 'shared/selectors';
import { getFormData, getErrors } from 'form/selectors';
import { setErrors, updateFormData } from 'form/actions';
import { fetchPaymentMethods, makePayment } from 'checkout/actions';
import { getPaymentMethods } from 'checkout/selectors';

export class PaymentConnect {
  static mapStateToProps = (state, ownProps) => {
    // stripe wallet is express checkout, ignore it on the payment panel.
    const paymentMethods = getPaymentMethods(state).filter(pm => !(pm.type === 'wallet' && pm.gateway === 'stripe'));

    return {
      isBusy: state.status === 'busy',
      paymentMethods: paymentMethods,
      cart: getCart(state),
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
