import { getSetting } from 'shared/selectors';
import { getFormData, getErrors } from 'form/selectors';
import { updateFormData, setErrors } from 'form/actions';
import { getIsBusy, getDonationPanelSelection, getSelectedFrequency, getPaymentMethods } from 'donate/selectors';
import { makePayment } from 'donate/actions';

export class PaymentConnect {
  static mapStateToProps = (state, ownProps) => {
    const selection = getDonationPanelSelection(state);

    return {
      isBusy: getIsBusy(state),
      amount: selection ? selection.amount : 0,
      frequency: getSelectedFrequency(state),
      paymentMethods: getPaymentMethods(state),
      formData: getFormData(state),
      errors: getErrors(state),
      variant: getSetting(state, 'variant'),
    };
  };

  static actions = {
    onShowPanel: () => async () => true,
    onSubmit: makePayment,
    updateFormData: updateFormData,
    setErrors: setErrors,
  };
}
