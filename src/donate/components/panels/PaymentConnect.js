import { getSetting, getCart, getCurrency } from 'shared/selectors';
import { getFormData, getErrors } from 'form/selectors';
import { updateFormData, setErrors } from 'form/actions';
import { getIsBusy, getPaymentMethods, getScheduleLabel, getDonationAmount, getDonationFrequency } from 'donate/selectors';
import { makePayment, cancelPaymentAuthorise } from 'donate/actions';
import { dispatchGoogleEcommerceEvent } from 'donate/actions/google-ecommerce';

export class PaymentConnect {
  static mapStateToProps = (state, ownProps) => {
    // 'wallet' types are for express donations, ignore them on the payment panel.
    const paymentMethods = getPaymentMethods(state).filter(pm => pm.type !== 'wallet');

    return {
      isBusy: getIsBusy(state),
      amount: getDonationAmount(state),
      frequency: getDonationFrequency(state),
      scheduleLabel: getScheduleLabel(state),
      currency: getCurrency(state).code,
      paymentMethods: paymentMethods,
      cartStatus: getCart(state).status,
      authSecret: getCart(state).authSecret,
      formData: getFormData(state),
      errors: getErrors(state),
      variant: getSetting(state, 'variant'),
      turnstileSiteKey: getSetting(state, 'turnstileSiteKey'),
      googleEcommerceEnabled: getSetting(state, 'googleEcommerceEnabled'),
    };
  };

  static actions = {
    onShowPanel: () => async () => true,
    onSubmit: makePayment,
    cancelPaymentAuthorise: cancelPaymentAuthorise,
    updateFormData: updateFormData,
    setErrors: setErrors,
    dispatchGoogleEcommerceEvent: dispatchGoogleEcommerceEvent,
  };
}
