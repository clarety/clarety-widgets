import { AuBankAccountElement, CardNumberElement } from '@stripe/react-stripe-js';
import Cookies from 'js-cookie';
import { isStripePaymentForm, isStripeBecs } from 'shared/utils';
import { ClaretyApi } from 'shared/utils/clarety-api';
import { getCart, getCurrency, getSetting } from 'shared/selectors';
import { DonationApi } from 'donate/utils';
import { getProcessingPaymentPostData } from 'donate/selectors';

export const prepareStripePayment = (paymentData, paymentMethod, frequency) => {
  return async (dispatch, getState) => {
    let result = null;
    if (isStripePaymentForm(paymentMethod)) {
      result = await createStripePaymentMethod(paymentData, paymentMethod);
    } else if (isStripeBecs(paymentMethod)) {
      result = await createStripeAuBankAccountRecurringToken(paymentData, paymentMethod);
    } else if (frequency === 'recurring') {
      result = await createStripeRecurringToken(paymentData, paymentMethod);
    } else {
      result = await createStripeSingleToken(paymentData, paymentMethod);
    }

    if (result.error) {
      const validationErrors = [{ message: result.error.message }];
      return { validationErrors };
    }

    if (result.stripeCustomPaymentMethodId) {
      return {
        stripeCustomPaymentMethodId: result.stripeCustomPaymentMethodId,
      };
    }

    const payment = {
      type: paymentMethod.type,
      gateway: paymentMethod.gateway,
      gatewayToken: result.token,
    }

    return { payment };
  };
};

export const authoriseStripePayment = (paymentResult, paymentData, paymentMethod) => {
  return async (dispatch, getState) => {
    const { stripe } = paymentData;
    const clientSecret = paymentResult.authoriseSecret;

    const result = await stripe.handleCardAction(clientSecret);

    if (result.error) {
      const validationErrors = [{ message: result.error.message }];
      return { validationErrors };
    }

    const payment = {
      type: paymentMethod.type,
      gatewayToken: paymentResult.gatewayToken,
      gateway: paymentMethod.gateway,
      gatewayAuthorised: 'passed',
    };

    return { payment };
  };
};

export const makeGatewayV2StripePayment = (paymentData, paymentMethod, frequency) => {
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

    // fetch a payment intent.
    const paymentSession = await DonationApi.createPaymentSession(cart.jwt, paymentMethod.account, paymentMethod.type, currency.code);
    if (!paymentSession || !paymentSession.paymentIntentClientSecret) {
      return {
        validationErrors: [{ message: 'Something went wrong' }],
      }
    }

    // set payment status to 'processing'.
    const processingPaymentPostData = getProcessingPaymentPostData(state);
    processingPaymentPostData.payment.type = 'gateway';
    processingPaymentPostData.payment.gatewayAccount = paymentMethod.account;
    processingPaymentPostData.payment.gatewayPaymentMethod = isStripePaymentForm(paymentMethod) ? elementsResult.selectedPaymentMethod : paymentMethod.type;
    if (processingPaymentPostData.payment.gatewayPaymentMethod === 'apple_pay') {
      processingPaymentPostData.payment.gatewayPaymentMethod = 'wallet';
      processingPaymentPostData.payment.walletType = 'apple-pay';
    }
    if (processingPaymentPostData.payment.gatewayPaymentMethod === 'google_pay') {
      processingPaymentPostData.payment.gatewayPaymentMethod = 'wallet';
      processingPaymentPostData.payment.walletType = 'google-pay';
    }
    if (processingPaymentPostData.payment.gatewayPaymentMethod === 'link') {
      processingPaymentPostData.payment.gatewayPaymentMethod = 'wallet';
      processingPaymentPostData.payment.walletType = 'stripe-link';
    }
    processingPaymentPostData.payment.currency = paymentData.currency;
    processingPaymentPostData.payment.gatewayReference = paymentSession.paymentIntentId;
    const processingPaymentResults = await ClaretyApi.post('donations/', processingPaymentPostData);
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

    const validationErrors = [{ message: result.error?.message || "An unexpected error occurred." }];
    return { validationErrors };
  };
};

const createStripeSingleToken = async (paymentData, paymentMethod) => {
  const { stripe, elements } = paymentData;

  const data = {
    type: 'card',
    card: elements.getElement(CardNumberElement),
    billing_details: getStripeBillingDetails(paymentData),
  };

  const result = await stripe.createPaymentMethod(data);

  return {
    error: result.error,
    token: result.paymentMethod ? result.paymentMethod.id : undefined,
  };
};

const createStripeRecurringToken = async (paymentData, paymentMethod) => {
  const { stripe, elements } = paymentData;

  const clientSecret = paymentMethod.setupIntentSecret;

  const data = {
    payment_method: {
      card: elements.getElement(CardNumberElement),
      billing_details: getStripeBillingDetails(paymentData),
    },
  };

  const result = await stripe.confirmCardSetup(clientSecret, data);

  return {
    error: result.error,
    token: result.setupIntent && result.setupIntent.payment_method,
  };
};

const createStripeAuBankAccountRecurringToken = async (paymentData, paymentMethod) => {
  const { stripe, elements } = paymentData;

  const clientSecret = paymentMethod.setupIntentSecret;
  const data = {
    payment_method: {
      au_becs_debit: elements.getElement(AuBankAccountElement),
      billing_details: getStripeBillingDetails(paymentData),
    },
  };

  const result = await stripe.confirmAuBecsDebitSetup(clientSecret, data);
  return {
    error: result.error,
    token: result.setupIntent && result.setupIntent.payment_method,
  };
};

const createStripePaymentMethod = async (paymentData, paymentMethod) => {
  const { stripe, elements } = paymentData;

  // Trigger form validation and wallet collection
  const { error: submitError, selectedPaymentMethod } = await elements.submit();
  if (submitError) {
    return { error: submitError };
  }

  if (selectedPaymentMethod.startsWith('cpmt_')) {
    // this is a "custom payment method" (https://docs.stripe.com/payments/payment-element/custom-payment-methods)
    return {
      stripeCustomPaymentMethodId: selectedPaymentMethod,
    };
  }

  const data = {
    elements,
    params: {
      billing_details: getStripeBillingDetails(paymentData),
    }
  };
  const result = await stripe.createPaymentMethod(data);

  return {
    error: result.error,
    token: result.paymentMethod ? result.paymentMethod.id : undefined,
    type: result.paymentMethod ? result.paymentMethod.type : undefined,
  };
}

function getStripeBillingDetails(paymentData) {
  // customerInfo is set via getStripeCustomerInfo() in the payment panel
  const billing_details = { ...paymentData.customerInfo };

  // Prefer cardName or accountName if present.
  if (paymentData.cardName) billing_details.name = paymentData.cardName;
  if (paymentData.accountName) billing_details.name = paymentData.accountName;

  return billing_details;
}
