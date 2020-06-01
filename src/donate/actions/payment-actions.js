import Cookies from 'js-cookie';
import { ClaretyApi } from 'clarety-utils';
import { statuses, setStatus, setRecaptcha, setPayment, updateCartData, prepareStripePayment, isStripe } from 'shared/actions';
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

    // Prepare payment.
    const prepared = await dispatch(preparePayment(paymentData, paymentMethod));
    if (!prepared) return false;

    // Attempt payment.
    const result = await dispatch(attemptPayment(paymentData, paymentMethod));
    if (!result) return false;

    // Handle result.
    return await dispatch(handlePaymentResult(result, paymentData, paymentMethod));
  };
};

const preparePayment = (paymentData, paymentMethod) => {
  return async (dispatch, getState) => {
    // Stripe payment.
    if (isStripe(paymentMethod)) {
      const state = getState();
      const frequency = getSelectedFrequency(state);
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
      default: throw new Error('handlePaymentResult not implemented for payment method', paymentMethod);
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
      return dispatch(handleStripe3dSecure(result, paymentData, paymentMethod));
    }

    throw new Error('handlePaymentAuthorise not implemented for payment method', paymentMethod);
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
      // Prepare payment.
      dispatch(setPayment({
        type: paymentMethod.type,
        gateway: paymentMethod.gateway,
        gatewayAuthorised: 'passed',
      }));

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
