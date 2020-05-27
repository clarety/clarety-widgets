import Cookies from 'js-cookie';
import { CardNumberElement } from '@stripe/react-stripe-js';
import { ClaretyApi } from 'clarety-utils';
import { statuses, setStatus, setRecaptcha, setPayment, updateCartData } from 'shared/actions';
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

    const { error, paymentMethod: token } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardNumberElement),
      billing_details: {
        name: paymentData.cardName
      },
    });

    if (error) {
      return dispatch(handleStripeError(error));
    } else {
      dispatch(setPayment({
        type: paymentMethod.type,
        gateway: paymentMethod.gateway,
        gatewayToken: token.id,
      }));
    
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
      dispatch(setPayment({
        type: paymentMethod.type,
        gateway: paymentMethod.gateway,
        gatewayToken: setupIntent.payment_method,
      }));
    
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
      return dispatch(handleStripePaymentResult(results[0], paymentData, paymentMethod));
    }
  };
};

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
