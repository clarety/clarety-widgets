import { ClaretyApi } from 'shared/utils/clarety-api';
import { setPayment, prepareStripePayment, setStatus, statuses, updateAppSettings, fetchSettings, clearRecaptcha } from 'shared/actions';
import { isStripe, isHkDirectDebit, isXendit, isXenditCard } from 'shared/utils';
import { setErrors } from 'form/actions';
import { getPaymentMethod } from 'donate/selectors';
import { makePaymentFailure, handleHKDirectDebitAuthorise, prepareXenditCardPayment, authoriseXenditPayment } from 'donate/actions';
import { getUpdatePaymentDetailsPostData } from 'update-payment-details/selectors';
import { settingsMap } from 'update-payment-details/utils';
import { getCart, getCurrency } from 'shared/selectors';

export const updatePaymentDetails = (paymentData) => {
  return async (dispatch, getState) => {
    dispatch(setStatus(statuses.busy));

    const state = getState();

    const paymentMethod = getPaymentMethod(state, paymentData.type);

    // Prepare payment details.
    const prepared = await dispatch(preparePaymentDetails(paymentData, paymentMethod));
    if (!prepared) {
      dispatch(setStatus(statuses.ready));
      return false;
    }

    // Attempt payment details update.
    const result = await dispatch(attemptUpdate(paymentData, paymentMethod));
    if (!result) {
      dispatch(setStatus(statuses.ready));
      return false;
    }

    // Handle result.
    return await dispatch(handleResult(result, paymentData, paymentMethod));
  };
};

const preparePaymentDetails = (paymentData, paymentMethod) => {
  return async (dispatch, getState) => {
    if (isStripe(paymentMethod)) {
      // Stripe payment.
      const result = await dispatch(prepareStripePayment(paymentData, paymentMethod));

      if (result.validationErrors) {
        dispatch(makePaymentFailure(result));
        dispatch(setErrors(result.validationErrors));
        return false;
      } else if (result.stripeCustomPaymentMethodId) {
        // a "custom" payment method was chosen (ie, a non-stripe payment method selected via a stripe payment method),
        // now we need to display the fields for the non-stripe payment method.
        const selectedPaymentMethod = getStripeCustomPaymentMethod(paymentMethod, result.stripeCustomPaymentMethodId);

        dispatch(updateAppSettings({
          modalPaymentMethod: selectedPaymentMethod,
        }));

        return false;
      } else {
        dispatch(setPayment(result.payment));
        return true;
      }
    } else if (isXendit(paymentMethod)) {
      // Xendit payment.
      const result = await dispatch(prepareXenditPayment(paymentData, paymentMethod, 'recurring'));
      if (result.validationErrors) {
        dispatch(makePaymentFailure(result));
        dispatch(setErrors(result.validationErrors));
        return false;
      } else {
        dispatch(setPayment(result.payment));
        return true;
      }
    } else {
      // Standard payment.

      dispatch(setPayment(paymentData));
      return true;
    }
  };
};

export const prepareXenditPayment = (paymentData, paymentMethod, frequency) => {
  return async (dispatch, getState) => {
    const state = getState();
    const cart = getCart(state);
    const currency = getCurrency(state);

    if (isXenditCard(paymentMethod)) {
      const postData = {
        gatewayAccount: paymentMethod.account,
        gatewayPaymentMethod: paymentMethod.type,
        currency: currency.code,
      };
      
      // fetch a payment session id.
      const response = await ClaretyApi.post('update-payment-details/payment-sessions', postData);
      if (!response || !response[0] || !response[0].paymentSessionUid) {
        return {
          validationErrors: [{ message: 'Something went wrong' }],
        }
      }
      const xenditSessionId = response[0].paymentSessionUid;

      return prepareXenditCardPayment(paymentData, paymentMethod, frequency, xenditSessionId, currency.code);
    }

    throw new Error('prepareXenditPayment not implemented for payment method');
  };
}

const attemptUpdate = (paymentData, paymentMethod) => {
  return async (dispatch, getState) => {
    const state = getState();
    const postData = getUpdatePaymentDetailsPostData(state);
    const results = await ClaretyApi.post('update-payment-details/', postData);
    return results[0];
  };
};

const handleResult = (result, paymentData, paymentMethod) => {
  return async (dispatch, getState) => {
    const state = getState();
    const cart = getCart(state);

    if (result.status === 'success') {
      // update succeeded. re-fetch the widget explain to get the updated recurrence statuses.
      const storeUid = cart.store;
      await dispatch(fetchSettings('update-payment-details/', { storeUid }, settingsMap));
      dispatch(setStatus('ready'));
      return true;
    } else if (result.status === 'error') {
      dispatch(setErrors(result.validationErrors));
      dispatch(setStatus('ready'));
      return false;
    } else if (result.status === 'authorise') {
      dispatch(setStatus('ready'));
      dispatch(clearRecaptcha());

      if (isXendit(paymentMethod)) {
        return dispatch(handleXenditAuthorise(result, paymentData, paymentMethod));
      } else if (isHkDirectDebit(paymentMethod)) {
        return dispatch(handleHKDirectDebitAuthorise(result, paymentData, paymentMethod));
      } else {
        throw new Error('handleResult authorise not implemented for payment method: ' +  JSON.stringify(paymentMethod));
      }
    } else {
      throw new Error('handleResult not implemented for status: ' + result.status);
    }
  };
};

const handleXenditAuthorise = (paymentResult, paymentData, paymentMethod) => {
  return async (dispatch, getState) => {
    const authResult = await dispatch(authoriseXenditPayment(paymentResult, paymentData, paymentMethod));

    if (authResult.validationErrors) {
      dispatch(setErrors(authResult.validationErrors));
      dispatch(setStatus(statuses.ready));
      return false;
    } else {
      // Prepare payment.
      dispatch(setPayment(authResult.payment));
      dispatch(clearRecaptcha());
      dispatch(setStatus(statuses.busy));

      // Attempt payment details update.
      const result = await dispatch(attemptUpdate(paymentData, paymentMethod));
      if (!result) {
        dispatch(setStatus(statuses.ready));
        return false;
      }

      // Handle result.
      return await dispatch(handleResult(result, paymentData, paymentMethod));
    }
  };
};

function getStripeCustomPaymentMethod(paymentMethod, stripeCustomPaymentMethodId) {
  const customPaymentTypes = paymentMethod.customPaymentTypes || [];
  const cusomPaymentMethod = customPaymentTypes.find(customPaymentType =>
    customPaymentType.customPaymentMethodId === stripeCustomPaymentMethodId
  );

  return cusomPaymentMethod?.settings ?? null;
}
