import Cookies from 'js-cookie';
import { ClaretyApi } from 'clarety-utils';
import { statuses, setStatus, setRecaptcha, setPayment, updateCartData, prepareStripePayment } from 'shared/actions';
import { setErrors } from 'form/actions';
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

    const paymentMethod = getPaymentMethod(state, paymentData.type);
    const attempt = await dispatch(attemptPayment(paymentData, paymentMethod));
    const result = await dispatch(handlePaymentResult(attempt, paymentData, paymentMethod));

    return result;
  };
};

const attemptPayment = (paymentData, paymentMethod) => {
  return async (dispatch, getState) => {
    const isStripe = paymentMethod.gateway === 'stripe' || paymentMethod.gateway === 'stripe-sca';

    if (paymentData.type === 'gatewaycc') {
      return isStripe
        ? dispatch(attemptStripePayment(paymentData, paymentMethod))
        : dispatch(attemptCreditCardPayment(paymentData, paymentMethod));
    }

    if (paymentData.type === 'gatewaydd') {
      return dispatch(attemptDirectDebitPayment(paymentData, paymentMethod));
    }

    throw new Error('attemptPayment not implemented for payment method', paymentMethod);
  };
};

const attemptStripePayment = (paymentData, paymentMethod) => {
  return async (dispatch, getState) => {
    const state = getState();
    const frequency = getSelectedFrequency(state);

    const result = await dispatch(prepareStripePayment(paymentData, paymentMethod, frequency));

    if (result.errors) {
      dispatch(setErrors(result.errors));
      dispatch(setStatus(statuses.ready));
      return false;
    } else {
      dispatch(setPayment(result.payment));
    
      const postData = getPaymentPostData(getState());
      dispatch(makePaymentRequest(postData));
    
      const results = await ClaretyApi.post('donations/', postData);
      return results[0];
    }
  };
};

const attemptCreditCardPayment = (paymentData, paymentMethod) => {
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

const attemptDirectDebitPayment = (paymentData, paymentMethod) => {
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

const handlePaymentResult = (result, paymentData, paymentMethod) => {
  return async (dispatch, getState) => {
    if (!result) return;

    if (result.status === 'authorise') {
      return dispatch(handlePaymentAuthorise(result, paymentData, paymentMethod));
    }

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

const handlePaymentAuthorise = (result, paymentData, paymentMethod) => {
  return async (dispatch, getState) => {
    const isStripe = paymentMethod.gateway === 'stripe' || paymentMethod.gateway === 'stripe-sca';

    if (isStripe) {
      return handleStripe3dSecure(result, paymentData, paymentMethod);
    }

    throw new Error('handlePaymentAuthorise not implemented for payment method', paymentMethod);
  };
};

const handleStripe3dSecure = (result, paymentData, paymentMethod) => {
  return async (dispatch, getState) => {
    const { stripe } = paymentData;
    const clientSecret = result.authoriseSecret;
    const { error, paymentIntent } = await stripe.handleCardAction(clientSecret);

    if (error) {
      dispatch(setErrors([{ message: error.message }]));
      dispatch(setStatus(statuses.ready));
      return false;
    } else {
      dispatch(updateCartData({
        uid: result.uid,
        jwt: result.jwt,
        status: result.status,
        customer: result.customer,
      }));
  
      dispatch(setPayment({
        type: paymentMethod.type,
        gateway: paymentMethod.gateway,
        gatewayAuthorised: 'passed',
      }));
  
      const postData = getPaymentPostData(getState());
      dispatch(makePaymentRequest(postData));
    
      const results = await ClaretyApi.post('donations/', postData);
      return dispatch(handlePaymentResult(results[0], paymentData, paymentMethod));
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
