import { ClaretyApi } from 'clarety-utils';
import { setCustomer } from 'shared/actions';
import { types } from 'donate/actions';
import {setFormData} from "form/actions";
import {updateAppSettings} from 'shared/actions';

export const fetchCustomer = () => {
  return async (dispatch) => {
    dispatch(fetchCustomerRequest());
    const results = await ClaretyApi.get(`donations/customer/`);
    const customer = results[0];
    let hasProfile = false;
    if (customer) {
      dispatch(fetchCustomerSuccess(customer));
      dispatch(setCustomer(customer));
      let customerData = {};
      if(customer.hasProfile) hasProfile = true;
      customerData['customer.firstName'] = customer.firstName;
      customerData['customer.lastName'] = customer.lastName;
      customerData['customer.email'] = customer.email;
      if(customer.billing &&
        customer.billing.country &&
        customer.billing.country.toLowerCase() == 'au') {
        const billing = customer.billing;
        const billingState = billing.state;
        customerData['customer.billing.address1'] = billing.address1;
        customerData['customer.billing.suburb'] = billing.suburb;
        customerData['customer.billing.postcode'] = billing.postcode;
        if(billingState){
          switch(billingState.toUpperCase()) {
            case 'NSW':
            case 'VIC':
            case 'QLD':
            case 'SA':
            case 'WA':
            case 'TAS':
            case 'ACT':
            case 'NT':
            //todo adam to look into state input bug; issue is if invalid state added QLD always selected i.e. first index
              customerData['customer.billing.state'] = billingState.toUpperCase();
          }
        }
      }
      dispatch(setFormData(customerData));
      dispatch(updateAppSettings({
        customerHasProfile:hasProfile
      }));

      return true;
    }
    dispatch(fetchCustomerFailure(customer));
    return false;
  };
};

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