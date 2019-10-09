import { ClaretyApi } from 'clarety-utils';
import { getPath } from 'shared/utils';
import { createStripeToken, parseStripeError } from 'donate/utils';
import { types } from 'checkout/actions';

export const gateways = {
  stripe: 'stripe',
};

export const fetchPaymentMethods = () => {
  return async (dispatch, getState) => {
    const { cart } = getState();

    dispatch(fetchPaymentMethodsRequest());

    const results = await ClaretyApi.get(`carts/${cart.cartUid}/payment-methods/`);

    if (!results) {
      dispatch(fetchPaymentMethodsFailure());
      return false;
    } else {
      dispatch(fetchPaymentMethodsSuccess(results));
      return true;
    }
  };
};

export const makePayment = (paymentData, paymentMethod) => {
  return async (dispatch, getState) => {
    const { cart } = getState();

    const { options } = paymentMethod;

    // Fetch stripe token.
    if (options && options.gateway === gateways.stripe) {
      dispatch(stripeTokenRequest(paymentData, options.stripeKey));

      const stripeToken = await createStripeToken(paymentData, options.stripeKey);

      if (stripeToken.error) {
        const errors = parseStripeError(stripeToken.error);
        dispatch(stripeTokenFailure(errors));
        return;
      }

      dispatch(stripeTokenSuccess(stripeToken));

      // Overwrite payment data with token.
      paymentData = { gatewayToken: stripeToken.id };
    }

    dispatch(makePaymentRequest(paymentData));

    const results = await ClaretyApi.post(`carts/${cart.cartUid}/payments/`, paymentData);
    const result = results[0];

    if (result.status === 'error' || result.status === 'failed') {
      dispatch(makePaymentFailure(result));
    } else {
      // Redirect on success.
      window.location.href = getPath('shop-app-confirm');
    }
  };
};


// Fetch Payment Methods

const fetchPaymentMethodsRequest = () => ({
  type: types.fetchPaymentMethodsRequest,
});

const fetchPaymentMethodsSuccess = results => ({
  type: types.fetchPaymentMethodsSuccess,
  results: results,
});

const fetchPaymentMethodsFailure = () => ({
  type: types.fetchPaymentMethodsFailure,
});

// Make Payment

const makePaymentRequest = paymentData => ({
  type: types.makePaymentRequest,
  paymentData: paymentData,
});

const makePaymentFailure = result => ({
  type: types.makePaymentFailure,
  result: result,
});

// Stripe Token

const stripeTokenRequest = (paymentData, stripeKey) => ({
  type: types.stripeTokenRequest,
  paymentData: paymentData,
  stripeKey: stripeKey,
});

const stripeTokenSuccess = token => ({
  type: types.stripeTokenSuccess,
  token: token,
});

const stripeTokenFailure = errors => ({
  type: types.stripeTokenFailure,
  errors: errors,
});
