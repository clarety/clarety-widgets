import { setPayment, isStripe, prepareStripePayment, authoriseStripePayment } from 'shared/actions';
import { getCart } from 'shared/selectors';
import { setErrors, clearErrors } from 'form/actions';
import { getCreateRegistrationPostData, getSubmitRegistrationPostData, getIsLoggedIn, getPaymentMethod } from 'registration/selectors';
import { types, updateAuthCustomer } from 'registration/actions';
import { RegistrationApi } from 'registration/utils';

export const createRegistration = () => {
  return async (dispatch, getState) => {
    const state = getState();

    const postData = getCreateRegistrationPostData(state);
    const forceExpress = !getIsLoggedIn(state);

    dispatch(clearErrors());
    dispatch(registrationCreateRequest(postData));
    
    const result = await RegistrationApi.createRegistration(postData, { forceExpress });

    if (result.status !== 'error') {
      dispatch(registrationCreateSuccess(result));

      if (postData.merchandise.length) {
        // If we have merch, update the delivery address of logged-in customer, then fetch the shipping options.
        await dispatch(updateAuthCustomer());
        await dispatch(fetchShippingOptions());
      }
      
      return true;
    } else {
      dispatch(registrationCreateFailure(result));
      dispatch(setErrors(result.validationErrors));
      return false;
    }
  };
};

export const fetchShippingOptions = () => {
  return async (dispatch, getState) => {
    const state = getState();
    const cart = getCart(state);

    dispatch(fetchShippingOptionsRequest(cart.id));

    const result = await RegistrationApi.fetchSale(cart.id);

    if (result.status !== 'error') {
      dispatch(fetchShippingOptionsSuccess(result));
      return true;
    } else {
      dispatch(fetchShippingOptionsFailure(result.validationErrors));
      return false;
    }
  };
};

export const updateShipping = (shippingKey) => {
  return async (dispatch, getState) => {
    const state = getState();
    const cart = getCart(state);

    dispatch(updateShippingRequest(cart.id, shippingKey));

    const result = await RegistrationApi.updateShipping(cart.id, shippingKey);

    if (result.status !== 'error') {
      dispatch(updateShippingSuccess(result));
      return true;
    } else {
      dispatch(updateShippingFailure(result));
      dispatch(setErrors(result.validationErrors));
      return false;
    }
  }
};

export const submitRegistration = (paymentData) => {
  return async (dispatch, getState) => {
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
    // Stripe payment.
    if (isStripe(paymentMethod)) {
      const result = await dispatch(prepareStripePayment(paymentData, paymentMethod));

      if (result.validationErrors) {
        dispatch(setErrors(result.validationErrors));
        return false;
      } else {
        dispatch(setPayment(result.payment));
        return true;
      }
    }
    
    // Standard payment.
    dispatch(setPayment(paymentData));
    return true;
  };
};

const attemptPayment = (paymentData, paymentMethod) => {
  return async (dispatch, getState) => {
    const state = getState();
    const postData = getSubmitRegistrationPostData(state);

    dispatch(registrationSubmitRequest(postData));

    const result = await RegistrationApi.submitRegistration(postData);
    return result;
  };
};

const handlePaymentResult = (result, paymentData, paymentMethod) => {
  return async (dispatch, getState) => {
    // TODO: temp api fix.
    if (result.status === 'Complete') result.status = 'complete';
    if (result.status === 'ok')       result.status = 'complete';

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
    dispatch(registrationSubmitFailure(result));
    dispatch(setErrors(result.validationErrors));
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
    dispatch(registrationSubmitSuccess(result));

    // Redirect on success.
    window.location.href = result.redirect;
  }
};

const handleStripeAuthorise = (paymentResult, paymentData, paymentMethod) => {
  return async (dispatch, getState) => {
    const authResult = await dispatch(authoriseStripePayment(paymentResult, paymentData, paymentMethod));

    if (authResult.validationErrors) {
      dispatch(setErrors(result.validationErrors));
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

// Create

const registrationCreateRequest = (postData) => ({
  type: types.registrationCreateRequest,
  postData: postData,
});

const registrationCreateSuccess = (result) => ({
  type: types.registrationCreateSuccess,
  result: result,
});

const registrationCreateFailure = (result) => ({
  type: types.registrationCreateFailure,
  result: result,
});

// Fetch Shipping Options

const fetchShippingOptionsRequest = (saleId) => ({
  type: types.fetchShippingOptionsRequest,
  saleId: saleId,
});

const fetchShippingOptionsSuccess = (result) => ({
  type: types.fetchShippingOptionsSuccess,
  result: result,
});

const fetchShippingOptionsFailure = (errors) => ({
  type: types.fetchShippingOptionsFailure,
  errors: errors,
});

// Update Shipping

const updateShippingRequest = (saleId, shippingKey) => ({
  type: types.updateShippingRequest,
  saleId: saleId,
  shippingKey: shippingKey,
});

const updateShippingSuccess = (result) => ({
  type: types.updateShippingSuccess,
  result: result,
});

const updateShippingFailure = (result) => ({
  type: types.updateShippingFailure,
  result: result,
});

// Submit

const registrationSubmitRequest = (postData) => ({
  type: types.registrationSubmitRequest,
  postData: postData,
});

const registrationSubmitSuccess = (result) => ({
  type: types.registrationSubmitSuccess,
  result: result,
});

const registrationSubmitFailure = (result) => ({
  type: types.registrationSubmitFailure,
  result: result,
});
