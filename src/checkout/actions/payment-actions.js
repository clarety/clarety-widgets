import Cookies from 'js-cookie';
import { ClaretyApi } from 'clarety-utils';
import { setPayment, prepareStripePayment, authoriseStripePayment, setStatus, statuses } from 'shared/actions';
import { getCart, getSetting } from 'shared/selectors';
import { getJwtSession, isStripe, splitName } from 'shared/utils';
import { setFormData } from 'form/actions';
import { types, createCustomer, updateSale } from 'checkout/actions';
import { getPaymentMethod, getPaymentPostData } from 'checkout/selectors';

export const fetchPaymentMethods = () => {
  return async (dispatch, getState) => {
    const state = getState();
    const cart = getCart(state);

    dispatch(fetchPaymentMethodsRequest());

    const results = await ClaretyApi.get(`carts/${cart.cartUid}/payment-methods/`);
    const result = results[0];

    if (!result) {
      dispatch(fetchPaymentMethodsFailure());
      return false;
    } else {
      dispatch(fetchPaymentMethodsSuccess(result));
      return true;
    }
  };
};

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

const preparePayment = (paymentData, paymentMethod) => {
  return async (dispatch, getState) => {
    if (isStripe(paymentMethod)) {
      // Stripe payment.

      const result = await dispatch(prepareStripePayment(paymentData, paymentMethod));

      if (result.validationErrors) {
        dispatch(makePaymentFailure(result));
        return false;
      } else {
        dispatch(setPayment(result.payment));
        return true;
      }
    } else {
      // Standard payment.

      // TODO: temp api fix...
      // carts api uses different expiry fields to the other apis.
      paymentData.expiryMonth = paymentData.cardExpiryMonth;
      paymentData.cardExpiryMonth = undefined;
      paymentData.expiryYear = paymentData.cardExpiryYear;
      paymentData.cardExpiryYear = undefined;

      dispatch(setPayment(paymentData));
      return true;
    }
  };
};

const attemptPayment = (paymentData, paymentMethod) => {
  return async (dispatch, getState) => {
    const state = getState();

    const cart = getCart(state);
    const postData = getPaymentPostData(state);

    dispatch(makePaymentRequest(postData));
    const results = await ClaretyApi.post(`carts/${cart.cartUid}/payments/`, postData);
    return results[0];
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

const handlePaymentError = (result, paymentData, paymentMethod) => {
  return async (dispatch, getState) => {
    dispatch(makePaymentFailure(result));
  };
};

const handlePaymentAuthorise = (result, paymentData, paymentMethod) => {
  return async (dispatch, getState) => {
    if (isStripe(paymentMethod)) {
      return dispatch(handleStripeAuthorise(result, paymentData, paymentMethod));
    }

    throw new Error('handlePaymentAuthorise not implemented for payment method: ' + JSON.stringify(paymentMethod));
  };
};

const handlePaymentComplete = (result, paymentData, paymentMethod) => {
  return async (dispatch, getState) => {
    dispatch(makePaymentSuccess(result));

    const state = getState();
    const confirmPageUrl = getSetting(state, 'confirmPageUrl');
    const jwtSession = getJwtSession();

    // Set cookie and redirect to confirm page.
    Cookies.set('jwtConfirm', jwtSession.jwtString);
    window.location.href = confirmPageUrl || 'shop-confirm.php';
  }
};

const handleStripeAuthorise = (paymentResult, paymentData, paymentMethod) => {
  return async (dispatch, getState) => {
    const authResult = await dispatch(authoriseStripePayment(paymentResult, paymentData, paymentMethod));

    if (authResult.validationErrors) {
      dispatch(makePaymentFailure(authResult));
      return false;
    } else {
      // Prepare payment.
      dispatch(setPayment(authResult.payment));

      // Attempt payment.
      const result = await dispatch(attemptPayment(paymentData, paymentMethod));
      if (!result) return false;

      // Handle result.
      return await dispatch(handlePaymentResult(result, paymentData, paymentMethod));
    }
  };
};

export const fetchStripePaymentIntent = () => {
  return async (dispatch, getState) => {
    const state = getState();
    const cart = getCart(state);
    const response = await ClaretyApi.get(`carts/${cart.cartUid}/stripe-payment-intent/`);
    return response[0];
  };
}

export const makeStripeWalletPayment = (stripePaymentMethod, stripePaymentIntent, shippingAddress, shippingOption) => {
  return async (dispatch, getState) => {
    const state = getState();

    dispatch(setStatus(statuses.busy));
    
    // Create customer.
    const { billing_details } = stripePaymentMethod;
    const { firstName, lastName } = splitName(billing_details.name);
    const formData = {
      'customer.forceNewCustomer': true,
      'customer.firstName':        firstName,
      'customer.lastName':         lastName,
      'customer.email':            billing_details.email,
      'customer.mobile':           billing_details.phone,
      'customer.billing.address1': billing_details.address.line1,
      'customer.billing.address2': billing_details.address.line2,
      'customer.billing.suburb':   billing_details.address.city,
      'customer.billing.state':    billing_details.address.state,
      'customer.billing.postcode': billing_details.address.postal_code,
      'customer.billing.country':  billing_details.address.country,
    };

    if (shippingAddress) {
      formData['customer.delivery.address1'] = shippingAddress.addressLine[0] || '';
      formData['customer.delivery.address2'] = shippingAddress.addressLine[1] || '';
      formData['customer.delivery.suburb']   = shippingAddress.city;
      formData['customer.delivery.state']    = shippingAddress.region;
      formData['customer.delivery.postcode'] = shippingAddress.postalCode;
      formData['customer.delivery.country']  = shippingAddress.country;
    }

    dispatch(setFormData(formData));
    const customerOk = await dispatch(createCustomer());
    if (!customerOk) return false;

    // Set selected shipping option.
    const shippingUid = shippingOption ? shippingOption.id : null;
    if (shippingUid) {
      dispatch(setFormData({ 'sale.shippingUid': shippingUid }));
      await dispatch(updateSale());
    }

    // Prepare payment.
    const paymentData = {
      type: 'wallet',
      gateway: 'stripe',
      gatewayToken: stripePaymentIntent.id,
    };
    const paymentMethod = getPaymentMethod(state, 'wallet', 'stripe');
    dispatch(setPayment(paymentData));
  
    // Attempt payment.
    const result = await dispatch(attemptPayment(paymentData, paymentMethod));
    if (!result) return false;

    // Handle result.
    return await dispatch(handlePaymentResult(result, paymentData, paymentMethod));
  };
};


// Fetch Payment Methods

const fetchPaymentMethodsRequest = () => ({
  type: types.fetchPaymentMethodsRequest,
});

const fetchPaymentMethodsSuccess = (result) => ({
  type: types.fetchPaymentMethodsSuccess,
  result: result,
});

const fetchPaymentMethodsFailure = () => ({
  type: types.fetchPaymentMethodsFailure,
});

// Make Payment

const makePaymentRequest = (paymentData) => ({
  type: types.makePaymentRequest,
  paymentData: paymentData,
});

const makePaymentSuccess = (result) => ({
  type: types.makePaymentSuccess,
  result: result,
});

const makePaymentFailure = (result) => ({
  type: types.makePaymentFailure,
  result: result,
});
