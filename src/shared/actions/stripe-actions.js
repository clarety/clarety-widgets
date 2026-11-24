import { AuBankAccountElement, CardNumberElement } from '@stripe/react-stripe-js';
import { isStripePaymentForm, isStripeBecs } from 'shared/utils';

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

export function getStripePaymentFormDetails(elementsResult) {
  const paymentMethod = elementsResult.selectedPaymentMethod;

  if (paymentMethod === 'apple_pay') {
    return { paymentMethod: 'card', walletType: 'apple-pay' };
  }

  if (paymentMethod === 'google_pay') {
    return { paymentMethod: 'card', walletType: 'google-pay' };
  }

  if (paymentMethod === 'link') {
    return { paymentMethod: 'card', walletType: 'stripe-link' };
  }

  return { paymentMethod, walletType: undefined };
}

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
