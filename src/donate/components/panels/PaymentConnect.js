import { getSetting } from 'shared/selectors';
import { getFormData, getErrors } from 'form/selectors';
import { setErrors } from 'form/actions';
import { getIsBusy, getSelectedAmount } from 'donate/selectors';
import { makePayment } from 'donate/actions';

export class PaymentConnect {
  static mapStateToProps = (state) => {
    return {
      isBusy: getIsBusy(state),
      amount: getSelectedAmount(state),
      paymentMethod: { type: 'gatewaycc' },
      formData: getFormData(state),
      errors: getErrors(state),
      variant: getSetting(state, 'variant'),
    };
  };

  static actions = {
    onShowPanel: () => async () => true,
    onSubmit: makePayment,
    setErrors: setErrors,
  };
}
