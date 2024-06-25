import { ClaretyApi } from 'clarety-utils';
import { setStatus, statuses } from 'shared/actions';
import { getSetting } from 'shared/selectors';
import { preparePayment, attemptPayment, handlePaymentError, handlePaymentAuthorise, makePaymentSuccess } from 'checkout/actions';
import { getPaymentMethod } from 'checkout/selectors';
import { getSubmitCasePostData } from 'case/selectors';
import { showCaseConfirmation } from 'case/actions';

export const makePayment = (paymentData) => {
  return async (dispatch, getState) => {
    dispatch(setStatus(statuses.busy));

    const state = getState();

    const paymentMethod = getPaymentMethod(state, paymentData.type);

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

const handlePaymentResult = (result, paymentData, paymentMethod) => {
  return async (dispatch, getState) => {
    // TODO: temp api fix.
    if (result.status === 'Complete') result.status = 'complete';

    switch (result.status) {
      case 'error':     return dispatch(handlePaymentError(result, paymentData, paymentMethod));
      case 'authorise': return dispatch(handlePaymentAuthorise(result, paymentData, paymentMethod));
      case 'complete':  return dispatch(handlePaymentComplete(result, paymentData, paymentMethod));
      default: throw new Error('handlePaymentResult not implemented for status: ' + result.status);
    }    
  }
};

const handlePaymentComplete = (result, paymentData, paymentMethod) => {
  return async (dispatch, getState) => {
    dispatch(makePaymentSuccess(result));
    
    const state = getState();
    const caseUid = getSetting(state, 'caseUid');
    const paidStage = getSetting(state, 'paidStage');

    const postData = getSubmitCasePostData(state);
    postData.cartUid = result.cartUid;
    postData.stage = paidStage;

    await ClaretyApi.post('cases/', postData);

    return showCaseConfirmation(state, caseUid);
  }
};
