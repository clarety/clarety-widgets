import Cookies from 'js-cookie';
import { ClaretyApi } from 'clarety-utils';
import { statuses, setStatus, setRecaptcha, setPayment, updateCartData } from 'shared/actions';
import { setErrors } from 'form/actions';
import { executeRecaptcha } from 'form/components';
import { types, addDonationToCart, addCustomerToCart } from 'donate/actions';
import { createStripeToken, parseStripeError } from 'donate/utils';
import { getPaymentData, getPaymentPostData } from 'donate/selectors';

export const makePayment = () => {
  return async (dispatch, getState) => {
    const { status } = getState();

    if (status !== statuses.ready) return;
    dispatch(setStatus(statuses.busy));

    const recaptcha = await executeRecaptcha();
    dispatch(setRecaptcha(recaptcha));
    if (!recaptcha) {
      dispatch(setStatus(statuses.ready));
      return false;
    }

    const state = getState();
    const paymentData = getPaymentData(state);

    let result;

    if (paymentData.type === 'gatewaycc') {
      result = await dispatch(makeCreditCardPayment(paymentData));
    }

    if (paymentData.type === 'gatewaydd') {
      result = await dispatch(makeDirectDebitPayment(paymentData));
    }

    return dispatch(handlePaymentResult(result));
  };
};

export const submitDonatePage = () => {
  return async (dispatch, getState) => {
    const { status } = getState();

    if (status !== statuses.ready) return;
    dispatch(setStatus(statuses.busy));

    // ReCaptcha.
    const recaptcha = await executeRecaptcha();
    dispatch(setRecaptcha(recaptcha));
    if (!recaptcha) {
      dispatch(setStatus(statuses.ready));
      return false;
    }

    // Update cart.
    dispatch(addDonationToCart());
    dispatch(addCustomerToCart());

    const state = getState();
    const paymentData = getPaymentData(state);

    let result;

    if (paymentData.type === 'gatewaycc') {
      result = await dispatch(makeCreditCardPayment(paymentData));
    }

    if (paymentData.type === 'gatewaydd') {
      result = await dispatch(makeDirectDebitPayment(paymentData));
    }

    return dispatch(handlePaymentResult(result));
  };
};

const makeCreditCardPayment = (paymentData) => {
  return async (dispatch, getState) => {
    const { settings } = getState();

    if (settings.payment.type === 'stripe') {
      return dispatch(makeStripeCCPayment(paymentData));
    }
      
    return dispatch(makeStandardCCPayment(paymentData));
  };
};

const makeStripeCCPayment = (paymentData) => {
  return async (dispatch, getState) => {
    const { settings } = getState();
  
    // Get stripe token.
    const stripeKey = settings.payment.publicKey;
    dispatch(stripeTokenRequest(paymentData, stripeKey));
    const tokenResult = await createStripeToken(paymentData, stripeKey);
  
    if (tokenResult.error) {
      dispatch(stripeTokenFailure(tokenResult));
      return {
        validationErrors: parseStripeError(tokenResult.error),
      };
    }
  
    dispatch(stripeTokenSuccess(tokenResult));
    dispatch(setPayment({ gatewayToken: tokenResult.id }));
  
    // Attempt payment.
    const state = getState();
    const postData = getPaymentPostData(state);
    dispatch(makePaymentRequest(postData));
  
    const results = await ClaretyApi.post('donations/', postData);
    return results[0];
  };
};

const makeStandardCCPayment = (paymentData) => {
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

const makeDirectDebitPayment = (paymentData) => {
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

// Stripe Token

const stripeTokenRequest = (postData) => ({
  type: types.stripeTokenRequest,
  postData: postData,
});

const stripeTokenSuccess = (result) => ({
  type: types.stripeTokenSuccess,
  result: result,
});

const stripeTokenFailure = (result) => ({
  type: types.stripeTokenFailure,
  result: result,
});
