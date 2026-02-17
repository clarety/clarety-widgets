import { isCreditCard } from 'shared/utils';
import { openPaymentAuthModal, closePaymentAuthModal } from 'shared/actions';
import { getCart, getCurrency } from 'shared/selectors';
import { DonationApi } from 'donate/utils';

export const prepareXenditPayment = (paymentData, paymentMethod, frequency) => {
  return async (dispatch, getState) => {
    const state = getState();
    const cart = getCart(state);
    const currency = getCurrency(state);

    // fetch a payment session id.
    const response = await DonationApi.createPaymentSession(cart.jwt, paymentMethod.account, paymentMethod.type, currency.code);
    if (!response || !response.paymentSessionUid) {
      return {
        validationErrors: [{ message: 'Something went wrong' }],
      }
    }
    const xenditSessionId = response.paymentSessionUid;

    if (isCreditCard(paymentMethod)) {
      return prepareXenditCardPayment(paymentData, paymentMethod, frequency, xenditSessionId, currency.code);
    }

    throw new Error('prepareXenditPayment not implemented for payment method');
  };
}

async function prepareXenditCardPayment(paymentData, paymentMethod, frequency, xenditSessionId, currency) {
  const cardData = {
    payment_session_id: xenditSessionId,
    card_number: paymentData.cardNumber,
    expiry_month: paymentData.cardExpiryMonth,
    expiry_year: paymentData.cardExpiryYear,
    cvn: paymentData.cardSecurityCode,
    cardholder_first_name: paymentData.cardFirstName,
    cardholder_last_name: paymentData.cardLastName,
    cardholder_email: paymentData.customerInfo.email,
    cardholder_phone_number: paymentData.customerInfo.mobile,
  };

  const [error, response] = await new Promise((resolve, reject) => {
    Xendit.setPublishableKey(paymentMethod.publicKey);
    Xendit.payment.collectCardData(cardData, (error, response) => {
      resolve([error, response]);
    });
  });

  if (error) {
    return {
      validationErrors: [{ message: error.message }],
    };
  } else {
    return {
      payment: {
        type: 'gateway',
        currency: currency,
        gatewayAccount: paymentMethod.account,
        gatewayPaymentMethod: paymentMethod.type,
        gatewaySessionUid: xenditSessionId,
        gatewayToken: frequency === 'recurring'
          ? response.payment_token_id
          : response.payment_request_id,
        redirectUrl: response.action_url,
      },
    };
  }
}

export const authoriseXenditPayment = (paymentResult, paymentData, paymentMethod) => {
  return async (dispatch, getState) => {
    const state = getState();
    const cart = getCart(state);

    dispatch(openPaymentAuthModal(cart.payment.redirectUrl));

    // wait for the 'clarety-payment-auth-result' event
    const result = await new Promise((resolve, reject) => {
      const onAuthResult = (event) => {
        window.removeEventListener('clarety-payment-auth-result', onAuthResult);
        resolve(event.detail.result);
      };

      window.addEventListener('clarety-payment-auth-result', onAuthResult);
    });

    dispatch(closePaymentAuthModal());

    if (result === 'success') {
      return {
        payment: {
          ...cart.payment,
          redirectUrl: undefined,
          gatewayAuthorised: 'passed',
        }
      };
    }

    return {
      validationErrors: [{ message: 'Purchase Authentication Failed' }],
    };
  };
};
