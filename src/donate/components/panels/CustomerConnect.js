import { getSetting, getTrackingData, getSourceOptions } from 'shared/selectors';
import { getFormData, getErrors } from 'form/selectors';
import { setErrors, setFormData } from 'form/actions';
import { getIsBusy, getCustomerHasProfile, getSelectedFrequency, getDonationPanelSelection } from 'donate/selectors';
import { addCustomerToCart } from 'donate/actions';

export class CustomerConnect {
  static mapStateToProps = (state) => {
    const selection = getDonationPanelSelection(state);

    return {
      isBusy: getIsBusy(state),
      formData: getFormData(state),
      errors: getErrors(state),

      amount: selection.amount,
      frequency: getSelectedFrequency(state),
      
      variant: getSetting(state, 'variant'),
      tracking: getTrackingData(state),

      emailReadonly: getCustomerHasProfile(state),
      defaultCountry: getSetting(state, 'defaultCountry'),
      sourceOptions: getSourceOptions(state),
      addressFinderKey: getSetting(state, 'addressFinderKey'),
    };
  };

  static actions = {
    onSubmit: addCustomerToCart,
    setFormData: setFormData,
    setErrors: setErrors,
  };
}
