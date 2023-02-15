import axios from 'axios';
import Cookies from 'js-cookie';
import { statuses, setStatus, setRecaptcha, clearRecaptcha, setPayment, updateCartData, prepareStripePayment, authoriseStripePayment, updateAppSettings } from 'shared/actions';
import { getSetting } from 'shared/selectors';
import { isHongKongDirectDebit, isStripe } from 'shared/utils';
import { setErrors, updateFormData } from 'form/actions';
import { executeRecaptcha } from 'form/components';
import { DonationApi } from 'donate/utils';
import { types, addDonationToCart, addCustomerToCart, setDonationStartDate } from 'donate/actions';
import { getStoreUid, getPaymentMethod, getPaymentPostData, getSelectedFrequency } from 'donate/selectors';

export const makePayment = (paymentData, { isPageLayout } = {}) => {
  return async (dispatch, getState) => {
    const state = getState();

    if (state.status !== statuses.ready) return false;
    dispatch(setStatus(statuses.busy));

    // ReCaptcha.
    const recaptcha = await executeRecaptcha();
    dispatch(setRecaptcha(recaptcha));
    if (!recaptcha) {
      dispatch(setStatus(statuses.ready));
      return false;
    }

    // Update cart in page layout.
    if (isPageLayout) {
      dispatch(addDonationToCart());
      dispatch(addCustomerToCart());
    }

    dispatch(setDonationStartDate());

    const paymentMethod = getPaymentMethod(state, paymentData.type);
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
    // Stripe payment.
    if (isStripe(paymentMethod)) {
      const result = await dispatch(prepareStripePayment(paymentData, paymentMethod, frequency));

      if (result.validationErrors) {
        dispatch(setErrors(result.validationErrors));
        dispatch(setStatus(statuses.ready));
        return false;
      } else {
        dispatch(setPayment(result.payment));
        return true;
      }
    }
    
    // Standard payment.
    dispatch(setPayment(paymentData));
    return true;
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

    if (isHongKongDirectDebit(paymentMethod)) {
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
          parent.postMessage({ redirect: confirmPageUrl }, '*');
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
    if (isHongKongDirectDebit(paymentMethod)) {
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
