import { ClaretyApi } from 'clarety-utils';
import { createStripeToken, parseStripeError } from 'donate/utils';
import { types } from 'checkout/actions';

export const fetchPaymentMethods = () => {
  return async (dispatch, getState) => {
    const { checkout } = getState();
    const { cart } = checkout;

    dispatch(fetchPaymentMethodsRequest());

    const results = await ClaretyApi.get(`carts/${cart.uid}/payment-methods/`);

    if (!results) {
      dispatch(fetchPaymentMethodsFailure());
    } else {
      dispatch(fetchPaymentMethodsSuccess(results));
    }
  };
};

export const makePayment = paymentData => {
  return async (dispatch, getState) => {
    const { checkout } = getState();
    const { cart } = checkout;

    dispatch(makePaymentRequest(paymentData));

    const results = await ClaretyApi.post(`carts/${cart.uid}/payments/`);
    const result = results[0];

    if (result.status === 'error') {
      dispatch(makePaymentFailure(result));
    } else {
      // Redirect on success.
      window.location.href = result.redirect;
    }
  };
};

// TODO: move to stripe actions??
const makeStripePayment = paymentData => {
  return async dispatch => {
    // TODO: get stripe key from payment method.
    const stripeKey = 'pk_test_5AVvhyJrg3yIEnWSMQVBl3mQ00mK2D2SOD';
    const stripeData = {
      cardNumber:  paymentData.cardNumber,
      expiryMonth: paymentData.expiryMonth,
      expiryYear:  paymentData.expiryYear,
      ccv:         paymentData.ccv,
    };

    dispatch(stripeTokenRequest(stripeData, stripeKey));

    const token = await createStripeToken(stripeData, stripeKey);

    if (token.error) {
      const errors = parseStripeError(token.error);
      dispatch(stripeTokenFailure(errors));
    } else {
      dispatch(stripeTokenSuccess(token));
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
// TODO: move to stripe actions??

const stripeTokenRequest = (stripeData, stripeKey) => ({
  type: types.stripeTokenRequest,
  stripeData: stripeData,
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
