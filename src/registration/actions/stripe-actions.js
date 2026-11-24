import Cookies from 'js-cookie';
import { isStripePaymentForm } from 'shared/utils';
import { getLanguage } from 'shared/translations';
import { ClaretyApi } from 'shared/utils/clarety-api';
import { getStripePaymentFormDetails } from 'shared/actions';
import { getCart, getCurrency, getSetting } from 'shared/selectors';
import { RegistrationApi } from 'registration/utils';
import { getSubmitRegistrationPostData } from 'registration/selectors';

export const makeGatewayV2StripeRegistrationPayment = (paymentData, paymentMethod) => {
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
    const postData = getSubmitRegistrationPostData(state);
    postData.clientStatus = 'processing';
    postData.type = 'gateway';
    postData.gatewayAccount = paymentMethod.account;
    postData.currency = currency.code;
    postData.gatewayReference = paymentSession.paymentIntentId;
    postData.gatewayPaymentMethod = paymentMethod.type;
    if (isStripePaymentForm(paymentMethod)) {
      const stripePaymentFormDetails = getStripePaymentFormDetails(elementsResult);
      postData.gatewayPaymentMethod = stripePaymentFormDetails.paymentMethod;
      postData.walletType = stripePaymentFormDetails.walletType;
    }
    const processingPaymentResult = await RegistrationApi.submitRegistration(postData);
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


    const confirmPageUrl = new URL(getSetting(state, 'confirmPageUrl'));
    const language = getLanguage();
    if (language) {
      confirmPageUrl.searchParams.set('language', language);
    }

    // NOTE: expect a redirect to happen during confirmPayment.
    // Any code after this will only be reached if there is an immediate error when confirming the payment.
    const result = await stripe.confirmPayment({
      elements,
      clientSecret: paymentSession.paymentIntentClientSecret,
      confirmParams: {
        return_url: confirmPageUrl.href,
      },
    });

    const validationErrors = [{
      message: result.error?.message || "An unexpected error occurred.",
    }];

    return { validationErrors };
  };
};
