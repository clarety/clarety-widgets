import { getCart } from 'shared/selectors';
import { setErrors, clearErrors } from 'form/actions';
import { getCreateRegistrationPostData, getSubmitRegistrationPostData, getIsLoggedIn } from 'registration/selectors';
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
    const postData = getSubmitRegistrationPostData(state, paymentData);

    dispatch(registrationSubmitRequest(postData));

    const result = await RegistrationApi.submitRegistration(postData);

    if (result.status !== 'error') {
      // Redirect on success.
      window.location.href = result.redirect;
    } else {
      dispatch(registrationSubmitFailure(result));
      dispatch(setErrors(result.validationErrors));
      return false;
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

const registrationSubmitFailure = (result) => ({
  type: types.registrationSubmitFailure,
  result: result,
});
