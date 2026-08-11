import { ClaretyApi } from 'shared/utils/clarety-api';
import { getSetting } from 'shared/selectors';
import { makePayment as makeCheckoutPayment } from 'checkout/actions';
import { getSubmitCasePostData } from 'case/selectors';
import { showCaseConfirmation } from 'case/actions';

export const makePayment = (paymentData) => {
  /**
   * use the checkout payment actions,
   * but provide an on complete handler to update the case sale+stage and show the case widget confirmation.
   */
  return makeCheckoutPayment(paymentData, onPaymentComplete);
};

const onPaymentComplete = async (result, paymentData, paymentMethod, dispatch, getState) => {
  const state = getState();
  const caseUid = getSetting(state, 'caseUid');
  const paidStage = getSetting(state, 'paidStage');

  const postData = getSubmitCasePostData(state);
  postData.cartUid = result.cartUid;
  postData.stage = paidStage;

  await ClaretyApi.post('cases/', postData);

  return dispatch(showCaseConfirmation(caseUid));
};
