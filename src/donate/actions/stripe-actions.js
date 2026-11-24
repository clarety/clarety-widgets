import Cookies from 'js-cookie';
import { isStripePaymentForm } from 'shared/utils';
import { ClaretyApi } from 'shared/utils/clarety-api';
import { getStripePaymentFormDetails } from 'shared/actions';
import { getCart, getCurrency, getSetting } from 'shared/selectors';
import { getPaymentPostData } from 'donate/selectors';

export const makeGatewayV2StripeDonationPayment = (paymentData, paymentMethod, frequency) => {
  return async (dispatch, getState) => {
    const { stripe, elements } = paymentData;
    const state = getState();
    const cart = getCart(state);
    const currency = getCurrency(state);

    const elementsResult = await elements.submit();
    if (elementsResult.error) {
      return {
        validationErrors: [{ message: elementsResult.error.message }],
      }
    }

    const paymentSession = await ClaretyApi.createPaymentSession(cart.jwt, paymentMethod.account, paymentMethod.type, currency.code);
    if (!paymentSession || !paymentSession.paymentIntentClientSecret) {
      return {
        validationErrors: [{ message: 'Something went wrong' }],
      }
    }

    // set payment status to 'processing'.
    const postData = getPaymentPostData(state);
    postData.payment.clientStatus = 'processing';
    postData.payment.type = 'gateway';
    postData.payment.gatewayAccount = paymentMethod.account;
    postData.payment.currency = paymentData.currency;
    postData.payment.gatewayReference = paymentSession.paymentIntentId;
    postData.payment.gatewayPaymentMethod = paymentMethod.type;
    if (isStripePaymentForm(paymentMethod)) {
      const stripePaymentFormDetails = getStripePaymentFormDetails(elementsResult);
      postData.payment.gatewayPaymentMethod = stripePaymentFormDetails.paymentMethod;
      postData.payment.walletType = stripePaymentFormDetails.walletType;
    }
    
    const processingPaymentResults = await ClaretyApi.post('donations/', postData);
    const processingPaymentResult = processingPaymentResults[0];
    if (processingPaymentResult.status === 'error') {
      return {
        validationErrors: [{ message: 'Something went wrong' }],
      }
    }

    if (window.location.protocol === 'https:') {
      Cookies.set('session-jwt', cart.jwt, { sameSite: 'none', secure: true });
    } else {
      Cookies.set('session-jwt', cart.jwt);
    }
    Cookies.set('session-jwt-source', window.location.href);

    // NOTE: expect a redirect to happen during confirmPayment.
    // Any code after this will only be reached if there is an immediate error when confirming the payment.
    const result = await stripe.confirmPayment({
      elements,
      clientSecret: paymentSession.paymentIntentClientSecret,
      confirmParams: {
        return_url: getSetting(state, 'confirmPageUrl'),
      },
    });

    const validationErrors = [{
      message: result.error?.message || "An unexpected error occurred.",
    }];
    
    return { validationErrors };
  };
};
