import { getSetting, getTrackingData, getSourceOptions } from 'shared/selectors';
import { getFormData, getErrors } from 'form/selectors';
import { setErrors, setFormData } from 'form/actions';
import { getIsBusy, getCustomerHasProfile, getSelectedFrequency, getDonationPanelSelection, getHasExpressPaymentMethods } from 'donate/selectors';
import { addCustomerToCart, createSale } from 'donate/actions';

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
      fetchedCustomer: getSetting(state, 'fetchedCustomer'),

      defaultCountry: getSetting(state, 'defaultCountry'),
      sourceOptions: getSourceOptions(state),
      addressFinderKey: getSetting(state, 'addressFinderKey'),
      addressFinderCountry: getSetting(state, 'addressFinderCountry'),

      hasExpressPaymentMethods: getHasExpressPaymentMethods(state),
    };
  };

  static actions = {
    onSubmit: onSubmit,
    setFormData: setFormData,
    setErrors: setErrors,
  };
}

function onSubmit() {
  return async (dispatch, getState) => {
    const state = getState();

    if (getSetting(state, 'createSaleOnCustomerPanel')) {
      return dispatch(createSale());
    } else {
      return dispatch(addCustomerToCart());
    }
  };
}
