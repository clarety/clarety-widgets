import { submitPaymentPanel } from 'donate/actions';
import { getSetting } from 'shared/selectors';
import { getFormData, getErrors } from 'form/selectors';
import { setErrors } from 'form/actions';
import { getIsBusy, getSelectedFrequency, getSelectedAmount } from 'donate/selectors';

export class PaymentConnect {
  static mapStateToProps = (state) => {
    return {
      isBusy: getIsBusy(state),
      amount: getSelectedAmount(state),
      frequency: getSelectedFrequency(state),
      formData: getFormData(state),
      errors: getErrors(state),
      variant: getSetting(state, 'variant'),
    };
  };

  static actions = {
    onSubmit: submitPaymentPanel,
    setErrors: setErrors,
  };
}
