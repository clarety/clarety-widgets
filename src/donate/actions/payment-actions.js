import { ClaretyApi } from 'clarety-utils';
import { setPayment } from 'shared/actions';
import { makePaymentRequest, stripeTokenRequest, stripeTokenSuccess, stripeTokenFailure } from 'donate/actions';
import { createStripeToken, parseStripeError } from 'donate/utils';
import { getPaymentData, getCustomerFullName, getPaymentPostData } from 'donate/selectors';

export class PaymentActions {
  async makeStripeCCPayment(dispatch, getState, { actions, validations }) {
    const { formData, settings } = getState();
  
    // Get stripe token.
  
    const paymentData = getPaymentData(formData);
    const stripeKey = settings.payment.publicKey;
    dispatch(stripeTokenRequest(paymentData, stripeKey));
    const tokenResult = await createStripeToken(paymentData, stripeKey);
  
    if (tokenResult.error) {
      dispatch(stripeTokenFailure(tokenResult));
      return {
        validationErrors: parseStripeError(tokenResult.error),
      };
    }
  
    dispatch(stripeTokenSuccess(tokenResult));
    dispatch(setPayment({ gatewayToken: tokenResult.id }));
  
    // Attempt payment.
  
    const state = getState();
    const postData = getPaymentPostData(state);
    dispatch(makePaymentRequest(postData));
  
    const results = await ClaretyApi.post('donations/', postData);
    return results[0];
  }
  
  async makeClaretyCCPayment(dispatch, getState, { actions, validations }) {
    const { formData } = getState();
  
    const paymentData = getPaymentData(formData);
    dispatch(setPayment({
      cardName: getCustomerFullName(formData),
      cardNumber: paymentData.cardNumber,
      cardExpiryMonth: paymentData.expiryMonth,
      cardExpiryYear: '20' + paymentData.expiryYear,
      cardSecurityCode: paymentData.ccv,
    }));
  
    const state = getState();
    const postData = getPaymentPostData(state);
    dispatch(makePaymentRequest(postData));
  
    const results = await ClaretyApi.post('donations/', postData);
    return results[0];
  }
}
