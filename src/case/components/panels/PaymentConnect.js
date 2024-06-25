import { getSetting, getCart, getCurrency, getIsBusy } from 'shared/selectors';
import { getFormData, getErrors } from 'form/selectors';
import { updateFormData, setErrors } from 'form/actions';
import { createCart, fetchCheckoutPaymentMethods, fetchPaymentMethods as fetchAllowedPaymentMethods } from 'checkout/actions';
import { makePayment } from 'case/actions';

export class PaymentConnect {
  static mapStateToProps = (state, ownProps) => {
    return {
      isBusy: getIsBusy(state),
      currency: getCurrency(state).code,
      paymentMethods: getSetting(state, 'paymentMethods'),
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
