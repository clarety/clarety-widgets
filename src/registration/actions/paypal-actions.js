import { statuses, setStatus } from 'shared/actions';
import { getPaymentMethod } from 'registration/selectors';
import { preparePayment, attemptPayment, handlePaymentResult } from 'registration/actions/registration-actions';

export const validatePayPal = (data) => {
  return async (dispatch, getState) => {
    const state = getState();

    if (state.status !== statuses.ready) return false;
    dispatch(setStatus(statuses.busy));

    return true;
  };
};

export const cancelPayPal = (data) => {
  return async (dispatch, getState) => {
    dispatch(setStatus(statuses.ready));
  }
};

export const makePayPalPayment = (data, order, authorization) => {
  return async (dispatch, getState) => {
    const state = getState();

    const paymentData = {
      type: 'wallet',
      gateway: 'paypal',
      gatewayToken: order.id,
    };

    const paymentMethod = getPaymentMethod(state, 'wallet', 'paypal');

    // Prepare payment.
    const prepared = await dispatch(preparePayment(paymentData, paymentMethod));
    if (!prepared) return false;

    // Attempt payment.
    const result = await dispatch(attemptPayment(paymentData, paymentMethod));
    if (!result) return false;

    // Handle result.
    return await dispatch(handlePaymentResult(result, paymentData, paymentMethod));
  };
};
