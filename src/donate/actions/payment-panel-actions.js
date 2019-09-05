import { push as pushRoute } from 'connected-react-router';
import { ClaretyApi } from 'clarety-utils';
import { statuses, setStatus, setPayment } from 'shared/actions';
import { setErrors, clearErrors } from 'form/actions';
import { setSuccessResult, makePaymentRequest, makePaymentSuccess, makePaymentFailure } from 'donate/actions';
import { stripeTokenRequest, stripeTokenSuccess, stripeTokenFailure } from 'donate/actions';
import { validateCard, createStripeToken, parseStripeError } from 'donate/utils';

export const submitPaymentPanel = () => {
  return async (dispatch, getState) => {
    const { status, settings, formData } = getState();

    if (status !== statuses.ready) return;

    dispatch(setStatus(statuses.busy));
    dispatch(clearErrors());

    // Validate card details.

    const paymentData = getPaymentData(formData);

    const errors = validateCard(paymentData);
    if (errors) {
      dispatch(setErrors(errors));
      dispatch(setStatus(statuses.ready));
      return;
    }

    // Attempt payment.

    let result;
    if (settings.payment.type === 'stripe') {
      result = await makeStripeCCPayment(dispatch, getState);
    } else {
      result = await makeClaretyCCPayment(dispatch, getState);
    }

    // Dispatch results.

    dispatch(setStatus(statuses.ready));

    if (result.validationErrors) {
      dispatch(makePaymentFailure(result));
      dispatch(setErrors(result.validationErrors));
    } else {
      dispatch(makePaymentSuccess(result));
      dispatch(setSuccessResult(result));
      dispatch(pushRoute('/success'));
    }
  };
};

async function makeStripeCCPayment(dispatch, getState) {
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

  const { cart } = getState();

  // Attempt payment.

  const postData = getPostData(cart);
  dispatch(makePaymentRequest(postData));

  const results = await ClaretyApi.post('donations/', postData);
  return results[0];
}

async function makeClaretyCCPayment(dispatch, getState) {
  const { formData } = getState();

  const paymentData = getPaymentData(formData);
  dispatch(setPayment({
    cardName: getCustomerFullName(formData),
    cardNumber: paymentData.cardNumber,
    cardExpiryMonth: paymentData.expiryMonth,
    cardExpiryYear: '20' + paymentData.expiryYear,
    cardSecurityCode: paymentData.ccv,
  }));

  const { cart } = getState();

  const postData = getPostData(cart);
  dispatch(makePaymentRequest(postData));

  const results = await ClaretyApi.post('donations/', postData);
  return results[0];
}

const getPaymentData = formData => {
  return {
    cardNumber:  formData['payment.cardNumber'],
    expiryMonth: formData['payment.expiryMonth'],
    expiryYear:  formData['payment.expiryYear'],
    ccv:         formData['payment.ccv'],
  };
};

const getCustomerFullName = formData => {
  const firstName = formData['customer.firstName'];
  const lastName  = formData['customer.lastName'];
  return `${firstName} ${lastName}`;
};

const getPostData = cart => {
  return {
    store: cart.store,
    uid: cart.uid,
    jwt: cart.jwt,
    saleline: cart.items[0],
    customer: cart.customer,
    payment: cart.payment,
  };
}