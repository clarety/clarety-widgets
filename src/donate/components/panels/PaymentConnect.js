import { getSetting } from 'shared/selectors';
import { getFormData, getErrors } from 'form/selectors';
import { updateFormData, setErrors } from 'form/actions';
import { getIsBusy, getSelectedAmount, getPaymentMethods, getStartDates } from 'donate/selectors';
import { makePayment } from 'donate/actions';

export class PaymentConnect {
  static mapStateToProps = (state, ownProps) => {
    return {
      isBusy: getIsBusy(state),
      amount: getSelectedAmount(state),
      paymentMethods: getPaymentMethods(state, ownProps.settings),
      startDates: getStartDates(state),
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
