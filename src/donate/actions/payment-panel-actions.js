import { push as pushRoute } from 'connected-react-router';
import { ClaretyApi } from 'clarety-utils';
import { statuses, setStatus, setPayment } from 'shared/actions';
import { parseNestedElements } from 'shared/utils';
import { setErrors, clearErrors } from 'form/actions';
import { setSuccessResult } from 'donate/actions';
import { validateCard, createStripeToken, parseStripeError } from 'donate/utils';

export const submitPaymentPanel = () => {
  return async (dispatch, getState) => {
    const { status, paymentData, settings } = getState();

    if (status !== statuses.ready) return;

    dispatch(setStatus(statuses.busy));
    dispatch(clearErrors());

    // Validate card details.

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
      dispatch(setErrors(result.validationErrors));
    } else {
      dispatch(setSuccessResult(result));
      dispatch(pushRoute('/success'));
    }
  };
};

async function makeStripeCCPayment(dispatch, getState) {
  const { formData, paymentData, cart, settings } = getState();

  // Get stripe token.

  const stripeKey = settings.payment.publicKey;
  const tokenResult = await createStripeToken(paymentData, stripeKey);

  if (tokenResult.error) {
    return {
      validationErrors: parseStripeError(tokenResult.error),
    };
  }

  // Attempt payment.

  const postData = parseNestedElements(formData);
  postData.saleline = cart.salelines[0];
  postData.payment = { gatewayToken: tokenResult.id };

  const results = await ClaretyApi.post('donations/', postData);
  return results[0];
}

async function makeClaretyCCPayment(dispatch, getState) {
  const { formData, paymentData, cart } = getState();

  const postData = parseNestedElements(formData);
  postData.saleline = cart.salelines[0];
  postData.payment = {
    cardName: getCustomerFullName(formData),
    cardNumber: paymentData.cardNumber,
    cardExpiryMonth: paymentData.expiryMonth,
    cardExpiryYear: '20' + paymentData.expiryYear,
    cardSecurityCode: paymentData.ccv,
  };

  const results = await ClaretyApi.post('donations/', postData);
  return results[0];
}

const getCustomerFullName = formData => {
  const firstName = formData['customer.firstName'];
  const lastName  = formData['customer.lastName'];
  return `${firstName} ${lastName}`;
}
