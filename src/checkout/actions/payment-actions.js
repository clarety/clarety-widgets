import Cookies from 'js-cookie';
import { ClaretyApi } from 'clarety-utils';
import { getCart } from 'shared/selectors';
import { getPath, getJwtSession } from 'shared/utils';
import { createStripeToken, parseStripeError } from 'donate/utils';
import { types } from 'checkout/actions';
import { getPaymentMethod } from 'checkout/selectors';

export const fetchPaymentMethods = () => {
  return async (dispatch, getState) => {
    const state = getState();
    const cart = getCart(state);

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

export const makePayment = (paymentData) => {
  return async (dispatch, getState) => {
    const state = getState();

    const cart = getCart(state);
    const paymentMethod = getPaymentMethod(state, paymentData.type);

    const { options } = paymentMethod;
    
    if (options && options.gateway === 'stripe') {
      // Fetch stripe token.

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
    } else {
      // Carts API has different expiry field names.
      paymentData.expiryMonth = paymentData.cardExpiryMonth;
      paymentData.cardExpiryMonth = undefined;
      paymentData.expiryYear = paymentData.cardExpiryYear;
      paymentData.cardExpiryYear = undefined;
    }

    dispatch(makePaymentRequest(paymentData));

    const results = await ClaretyApi.post(`carts/${cart.cartUid}/payments/`, paymentData);
    const result = results[0];

    if (result.status === 'error' || result.status === 'failed') {
      dispatch(makePaymentFailure(result));
    } else {
      // Redirect on success.
      const jwtSession = getJwtSession();
      Cookies.set('jwtConfirm', jwtSession.jwtString);
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
