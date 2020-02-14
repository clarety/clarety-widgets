import { getSetting } from 'shared/selectors';
import { getFormData, getErrors } from 'form/selectors';
import { setErrors } from 'form/actions';
import { fetchPaymentMethods, makePayment } from 'checkout/actions';
import { getPaymentMethod } from 'checkout/selectors';

export class PaymentConnect {
  static mapStateToProps = (state, ownProps) => {
    return {
      isBusy: state.status === 'busy',
      paymentMethod: getPaymentMethod(state),
      formData: getFormData(state),
      errors: getErrors(state),
      variant: getSetting(state, 'variant'),
    };
  };

  static actions = {
    onShowPanel: fetchPaymentMethods,
    onSubmit: makePayment,
    setErrors: setErrors,
  };
}
