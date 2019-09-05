import { push as pushRoute } from 'connected-react-router';
import { ClaretyApi } from 'clarety-utils';
import { statuses, setStatus, setPayment } from 'shared/actions';
import { parseNestedElements } from 'shared/utils';
import { setErrors, clearErrors } from 'form/actions';
import { setSuccessResult } from 'donate/actions';
import { validateCard, createStripeToken, parseStripeError } from 'donate/utils';

export const submitPaymentPanel = () => {
  return async (dispatch, getState) => {
    const state = getState();
    const { status, formData, paymentData, cart, settings } = state;

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

    // Get stripe token.

    let gatewayToken = cart.payment.gatewayToken;

    if (!gatewayToken) {
      const stripeKey = settings.payment.publicKey;
      const result = await createStripeToken(paymentData, stripeKey);

      if (result.error) {
        const errors = parseStripeError(result.error);
        dispatch(setErrors(errors));
        dispatch(setStatus(statuses.ready));
        return;
      }

      gatewayToken = result.id;
      dispatch(setPayment({ gatewayToken }));
    }

    // Attempt payment.

    const postData = parseNestedElements(formData);
    postData.saleline = cart.salelines[0];
    postData.payment = { gatewayToken };

    const results = await ClaretyApi.post('donations/', postData);
    const result = results[0];

    dispatch(setStatus(statuses.ready));

    if (result.validationErrors) {
      dispatch(setErrors(result.validationErrors));
    } else {
      dispatch(setSuccessResult(result));
      dispatch(pushRoute('/success'));
    }
  };
};
