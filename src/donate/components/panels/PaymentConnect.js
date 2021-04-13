import { getSetting, getCart } from 'shared/selectors';
import { getFormData, getErrors } from 'form/selectors';
import { updateFormData, setErrors } from 'form/actions';
import { getIsBusy, getDonationPanelSelection, getSelectedFrequency, getPaymentMethods, getScheduleLabel } from 'donate/selectors';
import { makePayment, cancelPaymentAuthorise } from 'donate/actions';

export class PaymentConnect {
  static mapStateToProps = (state, ownProps) => {
    const selection = getDonationPanelSelection(state);

    return {
      isBusy: getIsBusy(state),
      amount: selection ? selection.amount : 0,
      frequency: getSelectedFrequency(state),
      scheduleLabel: getScheduleLabel(state),
      paymentMethods: getPaymentMethods(state),
      cartStatus: getCart(state).status,
      authSecret: getCart(state).authSecret,
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
