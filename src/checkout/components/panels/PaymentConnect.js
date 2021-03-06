import { getSetting } from 'shared/selectors';
import { getFormData, getErrors } from 'form/selectors';
import { setErrors, updateFormData } from 'form/actions';
import { fetchPaymentMethods, makePayment } from 'checkout/actions';
import { getPaymentMethods } from 'checkout/selectors';

export class PaymentConnect {
  static mapStateToProps = (state, ownProps) => {
    return {
      isBusy: state.status === 'busy',
      paymentMethods: getPaymentMethods(state),
      formData: getFormData(state),
      errors: getErrors(state),
      variant: getSetting(state, 'variant'),
    };
  };

  static actions = {
    onShowPanel: fetchPaymentMethods,
    onSubmit: makePayment,
    updateFormData: updateFormData,
    setErrors: setErrors,
  };
}
