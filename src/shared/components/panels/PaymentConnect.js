import { getSetting, getCart } from 'shared/selectors';
import { getFormData, getErrors } from 'form/selectors';
import { updateFormData, setErrors } from 'form/actions';

export class PaymentConnect {
  static mapStateToProps = (state, ownProps) => {
    return {
      isBusy: state.status === 'busy',
      paymentMethods: [{ type: 'na' }],
      cartStatus: getCart(state).status,
      formData: getFormData(state),
      errors: getErrors(state),
      variant: getSetting(state, 'variant'),
      mainSiteUrl: getSetting(state, 'mainSiteUrl') || '',
    };
  };

  static actions = {
    onShowPanel: () => async () => true,
    onSubmit: () => async () => true,
    updateFormData: updateFormData,
    setErrors: setErrors,
  };
}
