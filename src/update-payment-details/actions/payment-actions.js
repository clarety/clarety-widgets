import { ClaretyApi } from 'shared/utils/clarety-api';
import { setPayment, prepareStripePayment, setStatus, statuses, updateAppSettings, fetchSettings, clearRecaptcha } from 'shared/actions';
import { isStripe, isHongKongDirectDebit } from 'shared/utils';
import { setErrors } from 'form/actions';
import { getPaymentMethod } from 'donate/selectors';
import { makePaymentFailure, handleHKDirectDebitAuthorise } from 'donate/actions';
import { getUpdatePaymentDetailsPostData } from 'update-payment-details/selectors';
import { settingsMap } from 'update-payment-details/utils';
import { getCart } from 'shared/selectors';

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
    } else {
      // Standard payment.

      dispatch(setPayment(paymentData));
      return true;
    }
  };
};

const attemptUpdate = (paymentData, paymentMethod) => {
  return async (dispatch, getState) => {
    const state = getState();
    const postData = getUpdatePaymentDetailsPostData(state);
    const results = await ClaretyApi.post(`update-payment-details/`, postData);
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

      if (isHongKongDirectDebit(paymentMethod)) {
        return dispatch(handleHKDirectDebitAuthorise(result, paymentData, paymentMethod));
      } else {
        throw new Error('handleResult authorise not implemented for payment method: ' +  JSON.stringify(paymentMethod));
      }
    } else {
      throw new Error('handleResult not implemented for status: ' + result.status);
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
