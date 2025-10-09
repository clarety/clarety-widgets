import axios from 'axios';
import Cookies from 'js-cookie';
import { statuses, setStatus, setRecaptcha, clearRecaptcha, setTurnstileToken, setPayment, setCustomer, updateCartData, prepareStripePayment, authoriseStripePayment, updateAppSettings, setPanelStatus } from 'shared/actions';
import { getSetting, getPanelManager } from 'shared/selectors';
import { isHkDirectDebit, isStripe, isXendit, splitName, convertCountry } from 'shared/utils';
import { setFormData, setErrors, updateFormData } from 'form/actions';
import { executeRecaptcha, currentTurnstileToken } from 'form/components';
import { DonationApi } from 'donate/utils';
import { types, addDonationToCart, addCustomerToCart, setDonationStartDate, selectAmount, selectSchedule, selectFrequency, prepareXenditPayment, authoriseXenditPayment } from 'donate/actions';
import { getStoreUid, getPaymentMethod, getCreateSalePostData, getPaymentPostData, getSelectedFrequency } from 'donate/selectors';

export const fetchIncompleteSale = () => {
  return async (dispatch, getState) => {
    const state = getState();

    // Fetch sale.
    dispatch(setStatus(statuses.initializing));
    const result = await DonationApi.fetchIncompleteDonation();
    dispatch(setStatus(statuses.ready));

    // Ensure we have a result.
    if (!result || !result.status || result.status === 'error') {
      console.warn('[Clarety] Unable to fetch incomplete donation');
      return;
    }

    // Ensure sale is incomplete.
    if (result.status !== 'incomplete') {
      console.warn('[Clarety] Fetched donation is not incomplete');
      return;
    }

    // Ensure we have a saleline.
    if (!result.salelines || !result.salelines.length) {
      console.warn('[Clarety] Fetched donation has no salelines');
      return;
    }

    const saleline = result.salelines[0];

    // Ensure we have an amount
    if (!saleline.price) {
      console.warn('[Clarety] Fetched incomplete sale without an amount');
      return;
    }

    // Ensure we have the offer.
    const offers = getSetting(state, 'priceHandles');
    const offer = offers.find(offer => offer.offerUid === saleline.offerUid);
    if (!offer) {
      console.warn('[Clarety] Fetched incomplete sale with an unknown offer');
      return;
    }

    // Ensure we have the offer payment.
    if (saleline.offerPaymentUid) {
      const offerPayment = offer.schedules.find(offerPayment => offerPayment.offerPaymentUid === saleline.offerPaymentUid);
      if (!offerPayment) {
        console.warn('[Clarety] Fetched incomplete sale with an unknown offer payment');
        return;
      }
    }    

    // Set the donation frquency / amount / schedule.
    const frequency = saleline.offerPaymentUid ? 'recurring' : 'single';
    const amount = saleline.price.toFixed(2)
    const isVariableAmount = !offer.amounts.find(handle => handle.amount === amount);
    dispatch(selectFrequency(frequency));
    dispatch(selectAmount(frequency, amount, isVariableAmount));
    if (saleline.offerPaymentUid) {
      dispatch(selectSchedule(saleline.offerPaymentUid));
    }

    // Update the cart.
    dispatch(updateCartData({
      uid: result.uid,
      jwt: result.jwt,
      status: result.status,
    }));
    dispatch(addDonationToCart());

    // Jump to the payment panel.
    if (getSetting(state, 'layout') !== 'page') {
      const panels = getPanelManager(state);
      for (let index = 0; index < panels.length; index += 1) {
        const panel = panels[index];
        if (panel.component.includes('PaymentPanel')) {
          dispatch(setPanelStatus(index, 'edit'));
          break;
        } else {
          dispatch(setPanelStatus(index, 'done'));
        }
      }
    }
  };
};

export const createSale = () => {
  return async (dispatch, getState) => {
    const state = getState();

    if (state.status !== statuses.ready) return false;
    dispatch(setStatus(statuses.busy));

    // ReCaptcha.
    if (getSetting(state, 'reCaptchaKey')) {
      const recaptcha = await executeRecaptcha();
      dispatch(setRecaptcha(recaptcha));
      if (!recaptcha) {
        dispatch(setStatus(statuses.ready));
        return false;
      }
    }

    // Turnstile.
    if (getSetting(state, 'turnstileSiteKey')) {
      const turnstileToken = currentTurnstileToken();
      dispatch(setTurnstileToken(turnstileToken));
      if (!turnstileToken) {
        dispatch(setErrors([{ message: 'Please verify you are human' }]));
        dispatch(setStatus(statuses.ready));
        return false;
      }
    }

    // Update cart in page layout.
    if (getSetting(state, 'layout') === 'page') {
      dispatch(addDonationToCart());
    }

    dispatch(addCustomerToCart());
    dispatch(setDonationStartDate());

    const postData = getCreateSalePostData(getState());
    const result = await DonationApi.createDonation(postData);

    dispatch(setStatus(statuses.ready));
    if (result.status === 'error') {
      dispatch(setErrors(result.validationErrors));
      return false;
    } else if (result.status === 'pending') {
      // Update our cart with the pending sale.
      const updatedCartData = {
        uid: result.uid,
        jwt: result.jwt,
        status: result.status,
      };
  
      if (result.customer) {
        updatedCartData.customer = result.customer;
      }
  
      dispatch(updateCartData(updatedCartData));
      return true;
    }
  };
};

export const makePayment = (paymentData) => {
  return async (dispatch, getState) => {
    const state = getState();

    if (state.status !== statuses.ready) return false;
    dispatch(setStatus(statuses.busy));

    // ReCaptcha.
    if (getSetting(state, 'reCaptchaKey')) {
      const recaptcha = await executeRecaptcha();
      dispatch(setRecaptcha(recaptcha));
      if (!recaptcha) {
        dispatch(setStatus(statuses.ready));
        return false;
      }
    }

    // Turnstile.
    if (getSetting(state, 'turnstileSiteKey')) {
      const turnstileToken = currentTurnstileToken();
      dispatch(setTurnstileToken(turnstileToken));
      if (!turnstileToken) {
        dispatch(setErrors([{ message: 'Please verify you are human' }]));
        dispatch(setStatus(statuses.ready));
        return false;
      }
    }

    // Update cart in page layout.
    if (getSetting(state, 'layout') === 'page') {
      dispatch(addDonationToCart());
      dispatch(addCustomerToCart());
    }

    dispatch(setDonationStartDate());

    const paymentMethod = getPaymentMethod(state, paymentData.type, paymentData.gateway);
    const frequency = getSelectedFrequency(state);

    // Prepare payment.
    const prepared = await dispatch(preparePayment(paymentData, paymentMethod, frequency));
    if (!prepared) return false;

    // Attempt payment.
    const result = await dispatch(attemptPayment(paymentData, paymentMethod));
    if (!result) return false;

    // Handle result.
    return await dispatch(handlePaymentResult(result, paymentData, paymentMethod));
  };
};

const preparePayment = (paymentData, paymentMethod, frequency) => {
  return async (dispatch, getState) => {
    if (isStripe(paymentMethod)) {
      // Stripe payment.
      const result = await dispatch(prepareStripePayment(paymentData, paymentMethod, frequency));

      if (result.validationErrors) {
        dispatch(setErrors(result.validationErrors));
        dispatch(setStatus(statuses.ready));
        return false;
      } else {
        dispatch(setPayment(result.payment));
        return true;
      }
    } else if (isXendit(paymentMethod)) {
      // Xendit payment.
      const result = await dispatch(prepareXenditPayment(paymentData, paymentMethod, frequency));

      if (result.validationErrors) {
        dispatch(setErrors(result.validationErrors));
        dispatch(setStatus(statuses.ready));
        return false;
      } else {
        dispatch(setPayment(result.payment));
        return true;
      }
    } else {
      // Standard payment.
      dispatch(setPayment(paymentData));
      return true;
    }
  };
};

const attemptPayment = (paymentData, paymentMethod) => {
  return async (dispatch, getState) => {
    const state = getState();
    const postData = getPaymentPostData(state);
    dispatch(makePaymentRequest(postData));
  
    return DonationApi.createDonation(postData);
  };
};

export const handlePaymentResult = (result, paymentData, paymentMethod) => {
  return async (dispatch, getState) => {

    const updatedCartData = {
      uid: result.uid,
      jwt: result.jwt,
      status: result.status,
    };

    if (result.customer) {
      updatedCartData.customer = result.customer;
    }

    dispatch(updateCartData(updatedCartData));

    switch (result.status) {
      case 'error':     return dispatch(handlePaymentError(result, paymentData, paymentMethod));
      case 'authorise': return dispatch(handlePaymentAuthorise(result, paymentData, paymentMethod));
      case 'complete':  return dispatch(handlePaymentComplete(result, paymentData, paymentMethod));
      default: throw new Error('handlePaymentResult not implemented for status:  ' + result.status);
    }    
  }
};

const handlePaymentError = (result, paymentData, paymentMethod) => {
  return async (dispatch, getState) => {
    if (isStripe(paymentMethod)) {
      // Fetch payment-methods again to get a new payment intent.
      await dispatch(fetchPaymentMethods());
    }

    dispatch(makePaymentFailure(result));
    dispatch(setErrors(result.validationErrors));
    dispatch(setStatus(statuses.ready));
    return false;
  };
};

const handlePaymentAuthorise = (result, paymentData, paymentMethod) => {
  return async (dispatch, getState) => {
    if (isStripe(paymentMethod)) {
      return dispatch(handleStripeAuthorise(result, paymentData, paymentMethod));
    }

    if (isXendit(paymentMethod)) {
      return dispatch(handleXenditAuthorise(result, paymentData, paymentMethod));
    }

    if (isHkDirectDebit(paymentMethod)) {
      return dispatch(handleHKDirectDebitAuthorise(result, paymentData, paymentMethod));
    }

    throw new Error('handlePaymentAuthorise not implemented for payment method: ' +  JSON.stringify(paymentMethod));
  };
};

const handlePaymentComplete = (result, paymentData, paymentMethod) => {
  return async (dispatch, getState) => {
    const state = getState();
    const confirmPageUrl = getSetting(state, 'confirmPageUrl');
    const confirmPageMode = getSetting(state, 'confirmPageMode') || 'redirect';
    
    dispatch(makePaymentSuccess(result));
    dispatch(updateCartData({ items: result.salelines }));

    if (confirmPageUrl) {      
      if (confirmPageMode === 'redirect' || confirmPageMode === 'redirect-iframe-parent') {
        // Redirect to confirm page, jwt is set in cookie.
        if (window.location.protocol === 'https:') {
          Cookies.set('session-jwt', result.jwt, { sameSite: 'none', secure: true });
        } else {
          Cookies.set('session-jwt', result.jwt);
        }

        if (confirmPageMode === 'redirect-iframe-parent') {
          parent.postMessage({ redirect: confirmPageUrl, jwt: result.jwt }, '*');
        } else {
          window.location.href = confirmPageUrl;
        }
      }
      
      if (confirmPageMode === 'replace') {
        // Replace current page with confirm page, jwt is set in header.
        const response = await axios.get(confirmPageUrl, { headers: { 'session-jwt': result.jwt } });
        document.querySelector('html').innerHTML = response.data;
      }
      
      return false;
    } else {
      dispatch(setStatus(statuses.ready));
      return true;
    }
  }
};

const handleStripeAuthorise = (paymentResult, paymentData, paymentMethod) => {
  return async (dispatch, getState) => {
    const authResult = await dispatch(authoriseStripePayment(paymentResult, paymentData, paymentMethod));

    if (authResult.validationErrors) {
      dispatch(setErrors(authResult.validationErrors));
      dispatch(setStatus(statuses.ready));
      return false;
    } else {
      // Prepare payment.
      dispatch(setPayment(authResult.payment));
      dispatch(clearRecaptcha());

      // Attempt payment.
      const result = await dispatch(attemptPayment(paymentData, paymentMethod));
      if (!result) return false;

      // Handle result.
      return await dispatch(handlePaymentResult(result, paymentData, paymentMethod));
    }
  };
};

const handleXenditAuthorise = (paymentResult, paymentData, paymentMethod) => {
  return async (dispatch, getState) => {
    const authResult = await dispatch(authoriseXenditPayment(paymentResult, paymentData, paymentMethod));

    if (authResult.validationErrors) {
      dispatch(setErrors(authResult.validationErrors));
      dispatch(setStatus(statuses.ready));
      return false;
    } else {
      // Prepare payment.
      dispatch(setPayment(authResult.payment));
      dispatch(clearRecaptcha());

      // Attempt payment.
      const result = await dispatch(attemptPayment(paymentData, paymentMethod));
      if (!result) return false;

      // Handle result.
      return await dispatch(handlePaymentResult(result, paymentData, paymentMethod));
    }
  };
};

const handleHKDirectDebitAuthorise = (paymentResult, paymentData, paymentMethod) => {
  return async (dispatch, getState) => {
    dispatch(updateCartData({
      authSecret: paymentResult.authoriseSecret,
    }));

    // Clear auth password field.
    dispatch(updateFormData('payment.authPassword', ''));

    dispatch(setStatus(statuses.ready));
  };
};

export const cancelPaymentAuthorise = (paymentMethod) => {
  return async (dispatch, getState) => {
    if (isHkDirectDebit(paymentMethod)) {
      return dispatch(cancelHKDirectDebitAuthorise(paymentMethod));
    }

    throw new Error('cancelPaymentAuthorise not implemented for payment method: ' +  JSON.stringify(paymentMethod));
  };
};

const cancelHKDirectDebitAuthorise = (paymentMethod) => {
  return async (dispatch, getState) => {
    dispatch(updateCartData({
      id: undefined,
      uid: undefined,
      jwt: undefined,
      status: undefined,
      authSecret: undefined,
    }));
  };
};

const fetchPaymentMethods = () => {
  return async (dispatch, getState) => {
    dispatch(fetchPaymentMethodsRequest());
    
    const state = getState();
    const storeUid = getStoreUid(state);
    const singleOfferId = getSetting(state, 'singleOfferId');
    const recurringOfferId = getSetting(state, 'recurringOfferId');
    const result = await DonationApi.fetchPaymentMethods(storeUid, singleOfferId, recurringOfferId);

    if (result.paymentMethods) {
      dispatch(fetchPaymentMethodsSuccess());
      dispatch(updateAppSettings({ paymentMethods: result.paymentMethods }));
      return true;
    } else {
      dispatch(fetchPaymentMethodsFailure());
      return false;
    }
  };
};

export const fetchStripePaymentIntent = ({ amount, currency }) => {
  return async (dispatch, getState) => {
    const state = getState();
    const storeUid = getStoreUid(state);
    return DonationApi.fetchStripePaymentIntent(storeUid, amount, currency);
  };
}

export const makeStripeWalletPayment = (stripePaymentMethod, stripePaymentIntent) => {
  return async (dispatch, getState) => {
    // Set cart donation.
    dispatch(addDonationToCart());

    const { billing_details } = stripePaymentMethod;
    const { firstName, lastName } = splitName(billing_details.name);

    // Set cart customer.
    const customerData = {
      firstName: firstName,
      lastName: lastName,
      email: billing_details.email,
      mobile: billing_details.phone,
      billing: {
        address1: billing_details.address.line1,
        address2: billing_details.address.line2,
        suburb:   billing_details.address.city,
        state:    billing_details.address.state,
        postcode: billing_details.address.postal_code,
        country:  convertCountry(billing_details.address.country),
      },
    };

    dispatch(setCustomer(customerData));

    // Set customer form data.
    const formData = {
      'customer.email':            customerData.email,
      'customer.firstName':        customerData.firstName,
      'customer.lastName':         customerData.lastName,
      'customer.mobile':           customerData.mobile,
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
      type: 'wallet',
      gateway: 'stripe',
      gatewayToken: stripePaymentIntent.id,
    };
    dispatch(setPayment(paymentData));

    // Post payment.
    const state = getState();
    const postData = getPaymentPostData(state);
    dispatch(makePaymentRequest(postData));
  
    const result = await DonationApi.createDonation(postData);

    // Handle result.
    const paymentMethod = getPaymentMethod(state, 'wallet', 'stripe');
    return dispatch(handlePaymentResult(result, paymentData, paymentMethod));
  };
};

// Make Payment

export const makePaymentRequest = (postData) => ({
  type: types.makePaymentRequest,
  postData: postData,
});

export const makePaymentSuccess = (result) => ({
  type: types.makePaymentSuccess,
  result: result,
});

export const makePaymentFailure = (result) => ({
  type: types.makePaymentFailure,
  result: result,
});

// Fetch Payment Methods

const fetchPaymentMethodsRequest = () => ({
  type: types.fetchPaymentMethodsRequest,
});

const fetchPaymentMethodsSuccess = (paymentMethods) => ({
  type: types.fetchPaymentMethodsSuccess,
  paymentMethods: paymentMethods,
});
