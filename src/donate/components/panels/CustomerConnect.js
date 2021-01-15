import { getSetting, getTrackingData, getSourceOptions } from 'shared/selectors';
import { getFormData, getErrors } from 'form/selectors';
import { setErrors, setFormData } from 'form/actions';
import { getIsBusy, getCustomerHasProfile, getSelectedFrequency, getDonationPanelSelection, getHasExpressPaymentMethods } from 'donate/selectors';
import { addCustomerToCart } from 'donate/actions';

export class CustomerConnect {
  static mapStateToProps = (state) => {
    const selection = getDonationPanelSelection(state);

    return {
      isBusy: getIsBusy(state),
      formData: getFormData(state),
      errors: getErrors(state),

      amount: selection ? selection.amount : 0,
      frequency: getSelectedFrequency(state),
      
      variant: getSetting(state, 'variant'),
      tracking: getTrackingData(state),

      canEditEmail: !getCustomerHasProfile(state),
      defaultCountry: getSetting(state, 'defaultCountry'),
      sourceOptions: getSourceOptions(state),
      addressFinderKey: getSetting(state, 'addressFinderKey'),

      hasExpressPaymentMethods: getHasExpressPaymentMethods(state),
    };
  };

  static actions = {
    onSubmit: addCustomerToCart,
    setFormData: setFormData,
    setErrors: setErrors,
  };
}
