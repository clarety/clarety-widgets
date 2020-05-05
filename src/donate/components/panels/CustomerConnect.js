import { getSetting } from 'shared/selectors';
import { getFormData, getErrors } from 'form/selectors';
import { setErrors } from 'form/actions';
import { getIsBusy, getCustomerHasProfile } from 'donate/selectors';
import { addCustomerToCart } from 'donate/actions';

export class CustomerConnect {
  static mapStateToProps = (state) => {
    return {
      emailReadonly:getCustomerHasProfile(state),
      isBusy: getIsBusy(state),
      formData: getFormData(state),
      errors: getErrors(state),
      variant: getSetting(state, 'variant'),
    };
  };

  static actions = {
    onSubmit: addCustomerToCart,
    setErrors: setErrors,
  };
}
