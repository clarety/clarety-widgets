import { push as pushRoute } from 'connected-react-router';
import { ClaretyApi } from 'clarety-utils';
import { statuses, setStatus, addSaleline, setPayment } from 'shared/actions';
import { updateFormData, setErrors, clearErrors } from 'form/actions';
import { setSuccessResult } from 'donate/actions';
import { validateCard, createStripeToken, parseStripeError } from 'donate/utils';

export const submitAmountPanel = () => {
  return (dispatch, getState) => {
    const state = getState();
    const { status, settings, panels } = state;
    const { amountPanel } = panels;

    if (status !== statuses.ready) return;

    dispatch(clearErrors());
    dispatch(setStatus(statuses.busy));

    // Make sure an amount has been selected.
    const selection = amountPanel.selections[amountPanel.frequency];
    if (!selection.amount) {
      dispatch(setErrors([{ message: 'Please select a donation amount.' }]));
      dispatch(setStatus(statuses.ready));
      return;
    }

    const offer = settings.offers.find(
      offer => offer.frequency === amountPanel.frequency
    );

    dispatch(addSaleline({
      offerUid: offer.offerUid,
      offerPaymentUid: offer.offerPaymentUid,
      price: selection.amount,
    }));

    dispatch(pushRoute('/details'));
    dispatch(setStatus(statuses.ready));
  };
};

export const submitDetailsPanel = () => {
  return async (dispatch, getState) => {
    const state = getState();
    const { status, formData, cart } = state;

    if (status !== statuses.ready) return;

    dispatch(setStatus(statuses.busy));
    dispatch(clearErrors());

    const postData = {
      ...formData,
      saleline: cart.salelines[0],
    };
    
    const results = await ClaretyApi.post('donations/', postData);
    const result = results[0];

    dispatch(setStatus(statuses.ready));

    if (result.validationErrors) {
      dispatch(setErrors(result.validationErrors));
    } else {
      dispatch(updateFormData('uid', result.uid));
      dispatch(updateFormData('jwt', result.jwt));
      dispatch(pushRoute('/payment'));
    }
  };
};

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

    const postData = {
      ...formData,
      saleline: cart.salelines[0],
      payment: { gatewayToken },
    };

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
