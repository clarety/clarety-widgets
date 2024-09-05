import { getSetting, getCart, getCurrency, getIsBusy } from 'shared/selectors';
import { getFormData, getErrors } from 'form/selectors';
import { updateFormData, setErrors } from 'form/actions';
import { createCart, fetchCheckoutPaymentMethods, fetchPaymentMethods as fetchAllowedPaymentMethods } from 'checkout/actions';
import { getPaymentMethods } from 'checkout/selectors';
import { makePayment } from 'case/actions';

export class PaymentConnect {
  static mapStateToProps = (state, ownProps) => {
    const cart = getCart(state);

    return {
      isBusy: getIsBusy(state),
      currency: cart.currency ? cart.currency.code : null,
      amount: cart.summary ? cart.summary.total : null,
      paymentMethods: getPaymentMethods(state),
      cartStatus: getCart(state).status,
      authSecret: getCart(state).authSecret,
      formData: getFormData(state),
      errors: getErrors(state),
      variant: getSetting(state, 'variant'),
      offerUid: getSetting(state, 'offerUid'),
    };
  };

  static actions = {
    onShowPanel: () => async () => true,
    onSubmit: makePayment,
    updateFormData: updateFormData,
    setErrors: setErrors,
    createCart: createCart,
    fetchPaymentMethods: fetchCheckoutPaymentMethods,
    fetchAllowedPaymentMethods: fetchAllowedPaymentMethods,
  };
}
