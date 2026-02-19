import { getFormData, getSetting, getCurrency, getCart } from 'shared/selectors';
import { updateFormData, setErrors } from 'form/actions';
import { getSelectedDonations } from 'update-payment-details/selectors';
import { updatePaymentDetails } from 'update-payment-details/actions';
import { updateAppSettings, statuses } from 'shared/actions';

export class PaymentDetailsConnect {
  static mapStateToProps = (state) => {
    // 'wallet' types are for express donations, ignore them on the payment panel.
    const paymentMethods = (getSetting(state, 'paymentMethods') || []).filter(pm => pm.type !== 'wallet');
    
    return {
      isBusy: state.status === statuses.busy,
      selectedDonations: getSelectedDonations(state),
      hasAuthError: getSetting(state, 'hasAuthError'),
      formData: getFormData(state),
      paymentMethods: paymentMethods,
      modalPaymentMethod: getSetting(state, 'modalPaymentMethod'),
      currency: getCurrency(state).code,
      cartStatus: getCart(state).status,
      authSecret: getCart(state).authSecret,
      stripeMode: 'setup',
    };
  };

  static actions = {
    onSubmit: updatePaymentDetails,
    updateFormData: updateFormData,
    setErrors: setErrors,
    onCloseModalPaymentMethod: () => updateAppSettings({ modalPaymentMethod: null }),
  };
}
