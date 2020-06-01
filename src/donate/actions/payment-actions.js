import Cookies from 'js-cookie';
import { ClaretyApi } from 'clarety-utils';
import { statuses, setStatus, setRecaptcha, setPayment, updateCartData, isStripe, prepareStripePayment, authoriseStripePayment } from 'shared/actions';
import { getSetting } from 'shared/selectors';
import { setErrors } from 'form/actions';
import { executeRecaptcha } from 'form/components';
import { types, addDonationToCart, addCustomerToCart } from 'donate/actions';
import { getPaymentMethod, getPaymentPostData, getSelectedFrequency } from 'donate/selectors';

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
  
    const results = await ClaretyApi.post('donations/', postData);
    return results[0];
  };
};

const handlePaymentResult = (result, paymentData, paymentMethod) => {
  return async (dispatch, getState) => {
    dispatch(updateCartData({
      uid: result.uid,
      jwt: result.jwt,
      status: result.status,
      customer: result.customer,
    }));

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

    throw new Error('handlePaymentAuthorise not implemented for payment method: ' +  JSON.stringify(paymentMethod));
  };
};

const handlePaymentComplete = (result, paymentData, paymentMethod) => {
  return async (dispatch, getState) => {
    const state = getState();
    const confirmPageUrl = getSetting(state, 'confirmPageUrl');
    
    dispatch(makePaymentSuccess(result));
    dispatch(updateCartData({ items: result.salelines }));

    if (confirmPageUrl) {
      // Redirect on success.
      Cookies.set('session-jwt', result.jwt);
      window.location.href = settings.confirmPageUrl;
      return false;
    } else {
      dispatch(setStatus(statuses.ready));
      return true;
    }
  }
};

const handleStripeAuthorise = (paymentResult, paymentData, paymentMethod) => {
  return async (dispatch, getState) => {
    const result = await dispatch(authoriseStripePayment(paymentResult, paymentData, paymentMethod));

    if (result.validationErrors) {
      dispatch(setErrors(result.validationErrors));
      dispatch(setStatus(statuses.ready));
      return false;
    } else {
      // Prepare payment.
      dispatch(setPayment(result.payment));

      // Attempt payment.
      const result = await dispatch(attemptPayment(paymentData, paymentMethod));
      if (!result) return false;

      // Handle result.
      return await dispatch(handlePaymentResult(result, paymentData, paymentMethod));
    }
  };
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
