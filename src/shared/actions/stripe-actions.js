import { AuBankAccountElement, CardNumberElement } from '@stripe/react-stripe-js';
import { isStripeAuBankAccount } from 'shared/utils';

export const prepareStripePayment = (paymentData, paymentMethod, frequency) => {
  return async (dispatch, getState) => {
    const result = isStripeAuBankAccount(paymentMethod) ?
        await createStripeAuBankAccountRecurringToken(paymentData, paymentMethod)
          : frequency === 'recurring'
               ? await createStripeRecurringToken(paymentData, paymentMethod)
               : await createStripeSingleToken(paymentData, paymentMethod);

    if (result.error) {
      const validationErrors = [{ message: result.error.message }];
      return { validationErrors };
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

const createStripeSingleToken = async (paymentData, paymentMethod) => {
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
    token: result.paymentMethod ? result.paymentMethod.id : undefined,
  };
};

const createStripeRecurringToken = async (paymentData, paymentMethod) => {
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
    token: result.setupIntent && result.setupIntent.payment_method,
  };
};

const createStripeAuBankAccountRecurringToken = async (paymentData, paymentMethod) => {
  const { stripe, elements } = paymentData;

  const clientSecret = paymentMethod.setupIntentSecret;
  const data = {
    payment_method: {
      au_becs_debit: elements.getElement(AuBankAccountElement),
      billing_details: {
        name: paymentData.accountName,
        email: paymentData.customerEmail, //email required for becs
      },
    },
  };

  const result = await stripe.confirmAuBecsDebitSetup(clientSecret, data);
  return {
    error: result.error,
    token: result.setupIntent && result.setupIntent.payment_method,
  };
};
