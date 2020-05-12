import { getSetting } from 'shared/selectors';
import { getFormData, getErrors } from 'form/selectors';
import { updateFormData, setErrors } from 'form/actions';
import { getPaymentMethods, getDonationPanelSelection, getSelectedFrequency } from 'donate/selectors';
import { makePayPalPayment, validatePayPal, cancelPayPal } from 'donate/actions';

export class ExpressCheckoutConnect {
  static mapStateToProps = (state, ownProps) => {
    return {
      isBusy: state.status === 'busy',
      paymentMethods: getPaymentMethods(state),
      amount: getDonationPanelSelection(state).amount,
      frequency: getSelectedFrequency(state),
      currency: getSetting(state, 'currency'),
      formData: getFormData(state),
      errors: getErrors(state),
      variant: getSetting(state, 'variant'),
    };
  };

  static actions = {
    onShowPanel: () => async () => true,
    onSubmit: () => async () => true,

    onPayPalClick: validatePayPal,
    onPayPalSuccess: makePayPalPayment,
    onPayPalCancel: cancelPayPal,
    onPayPalError: cancelPayPal,

    updateFormData: updateFormData,
    setErrors: setErrors,
  };
}
