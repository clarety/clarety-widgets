import { getSetting, getTrackingData } from 'shared/selectors';
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
      tracking: getTrackingData(state),
      defaultCountry: getSetting(state, 'defaultCountry') || 'AU',
    };
  };

  static actions = {
    onSubmit: addCustomerToCart,
    setErrors: setErrors,
  };
}
