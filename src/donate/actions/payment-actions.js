import Cookies from 'js-cookie';
import { ClaretyApi } from 'clarety-utils';
import { statuses, setStatus, setRecaptcha, setPayment, updateCartData } from 'shared/actions';
import { setErrors } from 'form/actions';
import { executeRecaptcha } from 'form/components';
import { types, addDonationToCart, addCustomerToCart } from 'donate/actions';
import { createStripeToken, parseStripeError } from 'donate/utils';
import { getPaymentMethod, getPaymentPostData } from 'donate/selectors';

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

    const paymentMethod = getPaymentMethod(state, paymentData.type);

    let result;
    switch (paymentData.type) {
      case 'gatewaycc':
        result = await dispatch(makeCreditCardPayment(paymentData, paymentMethod));
        break;

      case 'gatewaydd':
        result = await dispatch(makeDirectDebitPayment(paymentData, paymentMethod));
        break;

      default: throw new Error(`makePayment not handled for ${paymentData.type}`);
    }

    return dispatch(handlePaymentResult(result));
  };
};

const makeCreditCardPayment = (paymentData, paymentMethod) => {
  return async (dispatch, getState) => {
    if (paymentMethod.gateway === 'stripe') {
      return dispatch(makeStripeCCPayment(paymentData, paymentMethod));
    }
      
    return dispatch(makeStandardCCPayment(paymentData, paymentMethod));
  };
};

const makeStripeCCPayment = (paymentData, paymentMethod) => {
  return async (dispatch, getState) => {
    // Get stripe token.
    dispatch(stripeTokenRequest(paymentData, paymentMethod.publicKey));
    const tokenResult = await createStripeToken(paymentData, paymentMethod.publicKey);
  
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

const makeStandardCCPayment = (paymentData, paymentMethod) => {
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
