import { ClaretyApi } from 'clarety-utils';
import { statuses, setStatus, setRecaptcha, setPayment, setCustomer } from 'shared/actions';
import { setFormData } from 'form/actions';
import { executeRecaptcha } from 'form/components';
import { addDonationToCart } from 'donate/actions';
import { getPaymentPostData } from 'donate/selectors';

export const validatePayPal = (data) => {
  return async (dispatch, getState) => {
    const state = getState();

    if (state.status !== statuses.ready) return;
    dispatch(setStatus(statuses.busy));

    // ReCaptcha.
    const recaptcha = await executeRecaptcha();
    dispatch(setRecaptcha(recaptcha));

    if (!recaptcha) dispatch(setStatus(statuses.ready));

    return !!recaptcha;
  };
};

export const cancelPayPal = (data) => setStatus(statuses.ready);

export const makePayPalPayment = (data, order, authorization) => {
  return async (dispatch, getState) => {
    // Set cart donation.
    dispatch(addDonationToCart());

    const { payer } = order;
    const { address } = order.purchase_units[0].shipping;

    // Set cart customer.
    const customerData = {
      firstName: payer.name.given_name,
      lastName: payer.name.surname,
      email: payer.email_address,
      billing: {
        address1: address.address_line_1,
        address2: address.address_line_2,
        suburb:   address.admin_area_2,
        state:    address.admin_area_1,
        postcode: address.postal_code,
        country:  address.country_code,
      },
    };

    dispatch(setCustomer(customerData));

    // Set customer form data.
    const formData = {
      'customer.email':            customerData.email,
      'customer.firstName':        customerData.firstName,
      'customer.lastName':         customerData.lastName,
      'customer.billing.address1': customerData.billing.address1,
      'customer.billing.address2': customerData.billing.address2,
      'customer.billing.suburb':   customerData.billing.suburb,
      'customer.billing.state':    customerData.billing.state,
      'customer.billing.postcode': customerData.billing.postcode,
      'customer.billing.country':  customerData.billing.country,
    };
    dispatch(setFormData(formData));

    // Set cart payment.
    const paymentData = {
      type: 'paypal',
      gatewayToken: order.id,
    };
    dispatch(setPayment(paymentData));

    // Post payment.
    const state = getState();
    const postData = getPaymentPostData(state);
    dispatch(makePaymentRequest(postData));
  
    const results = await ClaretyApi.post('donations/', postData);
    const result = results[0];

    // Handle result.
    return dispatch(handlePaymentResult(result));
  };
};
