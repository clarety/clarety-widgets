import { setCustomer, updateAppSettings } from 'shared/actions';
import { setFormData } from 'form/actions';
import { DonationApi } from 'donate/utils';
import { types } from 'donate/actions';

export const fetchCustomer = () => {
  return async (dispatch, getState) => {
    dispatch(fetchCustomerRequest());
    const customer = await DonationApi.fetchCustomer();

    if (customer) {
      dispatch(fetchCustomerSuccess(customer));
      dispatch(setCustomer(customer));
      dispatch(setCustomerFormData(customer));
      dispatch(updateAppSettings({
        fetchedCustomer: true,
        customerHasProfile: customer.hasProfile,
      }));
      return true;
    } else {
      dispatch(fetchCustomerFailure(customer));
      return false;
    }
  };
};

export const setCustomerFormData = (customer) => {
  return async (dispatch, getState) => {
    const formData = {
      'customer.firstName': customer.firstName,
      'customer.lastName':  customer.lastName,
      'customer.email':     customer.email,
    };

    const { billing } = customer;

    if (billing) {
      formData['customer.billing.address1'] = billing.address1;
      formData['customer.billing.address2'] = billing.address2;
      formData['customer.billing.suburb']   = billing.suburb;
      formData['customer.billing.state']    = billing.state;
      formData['customer.billing.postcode'] = billing.postcode;
      formData['customer.billing.country']  = billing.country;

      if (billing.country === 'AU' && billing.state) {
        const state = billing.state.toUpperCase();
        if (['NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'ACT', 'NT'].includes(state)) {
          formData['customer.billing.state'] = state;
        } else {
          formData['customer.billing.state'] = undefined;
        }
      }
    }

    dispatch(setFormData(formData));
  }
}


// Fetch Customer

const fetchCustomerRequest = () => ({
  type: types.fetchDonationCustomerRequest,
});

const fetchCustomerSuccess = result => ({
  type: types.fetchDonationCustomerSuccess,
  result: result,
});

const fetchCustomerFailure = result => ({
  type: types.fetchDonationCustomerSuccess,
  result: result,
});
