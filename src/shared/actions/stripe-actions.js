import { AuBankAccountElement, CardNumberElement } from '@stripe/react-stripe-js';
import { isStripePaymentForm, isStripeAuBankAccount } from 'shared/utils';

export const prepareStripePayment = (paymentData, paymentMethod, frequency) => {
  return async (dispatch, getState) => {
    let result = null;
    if (isStripePaymentForm(paymentMethod)) {
      result = await createStripePaymentMethod(paymentData, paymentMethod);
    } else if (isStripeAuBankAccount(paymentMethod)) {
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
  const { error: submitError } = await elements.submit();
  if (submitError) {
    return { error: submitError };
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
