import { CardNumberElement } from '@stripe/react-stripe-js';

export function isStripe(paymentMethod) {
  return paymentMethod.gateway === 'stripe' || paymentMethod.gateway === 'stripe-sca';
}

export const prepareStripePayment = (paymentData, paymentMethod, frequency) => {
  return async (dispatch, getState) => {
    const result = frequency === 'recurring'
      ? await createStripeRecurringToken(paymentData, paymentMethod)
      : await createStripeSingleToken(paymentData, paymentMethod);

    if (result.error) {
      const errors = [{ message: result.error.message }];
      return { errors };
    }

    const payment = {
      type: paymentMethod.type,
      gateway: paymentMethod.gateway,
      gatewayToken: result.token,
    }

    return { payment };
  };
};

export const createStripeSingleToken = async (paymentData, paymentMethod) => {
  const { stripe, elements } = paymentData;

  const data = {
    type: 'card',
    card: elements.getElement(CardNumberElement),
    billing_details: {
      name: paymentData.cardName
    },
  };

  const result = await stripe.createPaymentMethod(data);

  return {
    error: result.error,
    token: result.paymentMethod.id,
  };
};

export const createStripeRecurringToken = async (paymentData, paymentMethod) => {
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

  const result = await stripe.confirmCardSetup(clientSecret, data);

  return {
    error: result.error,
    token: result.setupIntent.payment_method,
  };
};
