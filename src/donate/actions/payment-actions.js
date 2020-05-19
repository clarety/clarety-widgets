import Cookies from 'js-cookie';
import { CardNumberElement } from '@stripe/react-stripe-js';
import { ClaretyApi } from 'clarety-utils';
import { statuses, setStatus, setRecaptcha, setPayment, setCustomer, updateCartData } from 'shared/actions';
import { setFormData, setErrors } from 'form/actions';
import { executeRecaptcha } from 'form/components';
import { types, addDonationToCart, addCustomerToCart } from 'donate/actions';
import { getPaymentMethod, getPaymentPostData, getSelectedFrequency } from 'donate/selectors';

export const makePayment = (paymentData, { isPageLayout } = {}) => {
  return async (dispatch, getState) => {
    const state = getState();

    if (state.status !== statuses.ready) return;
    dispatch(setStatus(statuses.busy));

    // ReCaptcha.
    const recaptcha = await executeRecaptcha();
    dispatch(setRecaptcha(recaptcha));
    if (!recaptcha) {
      dispatch(setStatus(statuses.ready));
      return false;
    }

    if (isPageLayout) {
      // Update cart.
      dispatch(addDonationToCart());
      dispatch(addCustomerToCart());
    }

    const paymentType = paymentData.type;
    const paymentMethod = getPaymentMethod(state, paymentType);

    if (paymentType === 'gatewaycc') {
      if (paymentMethod.gateway === 'stripe' || paymentMethod.gateway === 'stripe-sca') {
        const result = await dispatch(makeStripePayment(paymentData, paymentMethod));
        return dispatch(handleStripePaymentResult(result, paymentData, paymentMethod));
      } else {
        const result = await dispatch(makeCreditCardPayment(paymentData, paymentMethod));
        return dispatch(handlePaymentResult(result));
      }
    }

    if (paymentType === 'gatewaydd') {
      const result = await dispatch(makeDirectDebitPayment(paymentData, paymentMethod));
      return dispatch(handlePaymentResult(result));
    }

    throw new Error(`makePayment not handled for paymentType: ${paymentType}`);
  };
};

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

    if (payer) {
      // Set cart customer.
      const customerData = {
        email: payer.email_address,
        billing: {},
      };

      if (payer.name) {
        customerData.firstName = payer.name.given_name;
        customerData.lastName  = payer.name.surname;
      }

      if (payer.address) {
        customerData.billing.address1 = payer.address.address_line_1;
        customerData.billing.address2 = payer.address.address_line_2;
        customerData.billing.suburb   = payer.address.admin_area_2;
        customerData.billing.state    = payer.address.admin_area_1;
        customerData.billing.postcode = payer.address.postal_code;
        customerData.billing.country  = payer.address.country_code;
      }

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
    }

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

const makeStripePayment = (paymentData, paymentMethod) => {
  return async (dispatch, getState) => {
    const state = getState();
    const frequency = getSelectedFrequency(state);

    if (frequency === 'single') {
      return dispatch(makeStripeSinglePayment(paymentData, paymentMethod));
    } else {
      return dispatch(makeStripeRecurringPayment(paymentData, paymentMethod));
    }
  };
};

const makeStripeSinglePayment = (paymentData, paymentMethod) => {
  return async (dispatch, getState) => {
    const { stripe, elements } = paymentData;

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardNumberElement),
      billing_details: {
        name: paymentData.cardName
      },
    });

    if (error) {
      return dispatch(handleStripeError(error));
    } else {
      dispatch(setPayment({ gatewayToken: paymentMethod.id }));
    
      // Attempt payment.
      const postData = getPaymentPostData(getState());
      dispatch(makePaymentRequest(postData));
    
      const results = await ClaretyApi.post('donations/', postData);
      return results[0];
    }
  };
};

const makeStripeRecurringPayment = (paymentData, paymentMethod) => {
  return async (dispatch, getState) => {
    const { stripe, elements } = paymentData;

    const clientSecret = paymentMethod.setupIntentSecret;

    const data = {
      payment_method: {
        card: elements.getElement(CardNumberElement),
        billing_details: {
          name: paymentData.cardName,
        },
      },
    };

    const { error, setupIntent } = await stripe.confirmCardSetup(clientSecret, data);

    if (error) {
      return dispatch(handleStripeError(error));
    } else {
      console.log('setupIntent', setupIntent);

      dispatch(setPayment({ gatewayToken: setupIntent.payment_method }));
    
      // Attempt payment.
      const postData = getPaymentPostData(getState());
      dispatch(makePaymentRequest(postData));
    
      const results = await ClaretyApi.post('donations/', postData);
      return results[0];
    }
  };
};

const handleStripeError = (error) => {
  return async (dispatch, getState) => {
    dispatch(setErrors([{ message: error.message }]));
    dispatch(setStatus(statuses.ready));
  };
};

const handleStripePaymentResult = (result, paymentData, paymentMethod) => {
  return async (dispatch, getState) => {
    if (!result) return;

    console.log('handleStripePaymentResult', result);
    
    if (result.status === 'authorise') {
      // Handle 3D secure.
      return dispatch(handleStripe3dSecure(result, paymentData, paymentMethod));
    } else {
      // Use standard payment result handling.
      return dispatch(handlePaymentResult(result));
    }
  };
};

const handleStripe3dSecure = (result, paymentData, paymentMethod) => {
  return async (dispatch, getState) => {
    const { stripe } = paymentData;
    const clientSecret = result.authoriseSecret;
    const { error, paymentIntent } = await stripe.handleCardAction(clientSecret);

    if (error) {
      return dispatch(handleStripeError(error));
    }

    console.log('handleCardAction ok!');
    console.log('paymentIntent', paymentIntent);

    dispatch(setPayment({ gatewayToken: undefined, gatewayAuthorised: 'passed' }));

    const postData = getPaymentPostData(getState());
    dispatch(makePaymentRequest(postData));
  
    const results = await ClaretyApi.post('donations/', postData);
    const result = results[0];
    dispatch(handleStripePaymentResult(result, paymentData, paymentMethod));
  };
};

// const makeCreditCardPayment = (paymentData, paymentMethod) => {
//   return async (dispatch, getState) => {
//     if (paymentMethod.gateway === 'stripe') {
//       return dispatch(makeStripeCCPayment(paymentData, paymentMethod));
//     }
      
//     return dispatch(makeStandardCCPayment(paymentData, paymentMethod));
//   };
// };

// const makeStripeCCPayment = (paymentData, paymentMethod) => {
//   return async (dispatch, getState) => {
//     // Get stripe token.
//     dispatch(stripeTokenRequest(paymentData, paymentMethod.publicKey));
//     const tokenResult = await createStripeToken(paymentData, paymentMethod.publicKey);
  
//     if (tokenResult.error) {
//       dispatch(stripeTokenFailure(tokenResult));
//       return {
//         validationErrors: parseStripeError(tokenResult.error),
//       };
//     }
  
//     dispatch(stripeTokenSuccess(tokenResult));
//     dispatch(setPayment({ gatewayToken: tokenResult.id }));
  
//     // Attempt payment.
//     const state = getState();
//     const postData = getPaymentPostData(state);
//     dispatch(makePaymentRequest(postData));
  
//     const results = await ClaretyApi.post('donations/', postData);
//     return results[0];
//   };
// };

const makeCreditCardPayment = (paymentData, paymentMethod) => {
  return async (dispatch, getState) => {
    let state = getState();
  
    dispatch(setPayment(paymentData));
  
    state = getState();
    const postData = getPaymentPostData(state);
    dispatch(makePaymentRequest(postData));
  
    const results = await ClaretyApi.post('donations/', postData);
    return results[0];
  };
};

const makeDirectDebitPayment = (paymentData, paymentMethod) => {
  return async (dispatch, getState) => {
    let state = getState();
  
    dispatch(setPayment(paymentData));
  
    state = getState();
    const postData = getPaymentPostData(state);
    dispatch(makePaymentRequest(postData));
  
    const results = await ClaretyApi.post('donations/', postData);
    return results[0];
  };
};

const handlePaymentResult = (result) => {
  return async (dispatch, getState) => {
    const { settings } = getState();

    if (result.validationErrors) {
      dispatch(makePaymentFailure(result));

      dispatch(updateCartData({
        uid: result.uid,
        jwt: result.jwt,
        status: result.status,
        customer: result.customer,
      }));

      dispatch(setErrors(result.validationErrors));
      dispatch(setStatus(statuses.ready));
      return false;
    } else {
      dispatch(makePaymentSuccess(result));

      dispatch(updateCartData({
        uid: result.uid,
        jwt: result.jwt,
        status: result.status,
        customer: result.customer,
        items: result.salelines,
      }));

      if (settings.confirmPageUrl) {
        // Redirect on success.
        Cookies.set('session-jwt', result.jwt);
        window.location.href = settings.confirmPageUrl;
      } else {
        dispatch(setStatus(statuses.ready));
        return true;
      }
    }
  }
};


// Make Payment

const makePaymentRequest = (postData) => ({
  type: types.makePaymentRequest,
  postData: postData,
});

const makePaymentSuccess = (result) => ({
  type: types.makePaymentSuccess,
  result: result,
});

const makePaymentFailure = (result) => ({
  type: types.makePaymentFailure,
  result: result,
});

// // Stripe Token

// const stripeTokenRequest = (postData) => ({
//   type: types.stripeTokenRequest,
//   postData: postData,
// });

// const stripeTokenSuccess = (result) => ({
//   type: types.stripeTokenSuccess,
//   result: result,
// });

// const stripeTokenFailure = (result) => ({
//   type: types.stripeTokenFailure,
//   result: result,
// });
