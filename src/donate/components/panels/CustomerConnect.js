import { getSetting, getTrackingData, getSourceOptions } from 'shared/selectors';
import { getFormData, getErrors } from 'form/selectors';
import { setErrors, setFormData } from 'form/actions';
import { getIsBusy, getCustomerHasProfile, getHasExpressPaymentMethods, getDonationAmount, getDonationFrequency } from 'donate/selectors';
import { addCustomerToCart, createSale } from 'donate/actions';

export class CustomerConnect {
  static mapStateToProps = (state) => {
    return {
      isBusy: getIsBusy(state),
      formData: getFormData(state),
      errors: getErrors(state),

      amount: getDonationAmount(state),
      frequency: getDonationFrequency(state),
      
      variant: getSetting(state, 'variant'),
      tracking: getTrackingData(state),

      canEditEmail: !getCustomerHasProfile(state),
      fetchedCustomer: getSetting(state, 'fetchedCustomer'),
      fetchedCustomerOptIn: getSetting(state, 'fetchedCustomerOptIn'),

      defaultCountry: getSetting(state, 'defaultCountry'),
      sourceOptions: getSourceOptions(state),
      addressFinderKey: getSetting(state, 'addressFinderKey'),
      addressFinderCountry: getSetting(state, 'addressFinderCountry'),
      loqateKey: getSetting(state, 'loqateKey'),
      loqateCountry: getSetting(state, 'loqateCountry'),
      apimap: getSetting(state, 'apimap'),

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
