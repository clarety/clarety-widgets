import { getSetting } from 'shared/selectors';
import { getFormData, getErrors } from 'form/selectors';
import { setErrors, updateFormData } from 'form/actions';
import { submitRegistration, updateShipping } from 'registration/actions';
import { getCart, getPaymentMethods } from 'registration/selectors';

export class PaymentConnect {
  static mapStateToProps = (state, ownProps) => {
    return {
      isBusy: state.status === 'busy',
      errors: getErrors(state),
      paymentMethods: getPaymentMethods(state),
      formData: getFormData(state),
      submitBtnTitle: 'Submit Registration',
      cart: getCart(state),
      errors: getErrors(state),
      variant: getSetting(state, 'variant'),
    };
  };
  
  static actions = {
    onShowPanel: () => async () => true,
    onSubmit: submitRegistration,
    updateShipping: updateShipping,
    updateFormData: updateFormData,
    setErrors: setErrors,
  };
}
