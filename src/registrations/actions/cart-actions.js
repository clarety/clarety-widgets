import { ClaretyApi, Config } from 'clarety-utils';
import { setErrors, clearErrors } from 'form/actions';
import { getCreateRegistrationPostData, getSubmitRegistrationPostData, getSaleId, getIsLoggedIn } from 'registrations/selectors';
import { types } from 'registrations/actions';

export const createRegistration = () => {
  return async (dispatch, getState) => {
    const state = getState();
    const isLoggedIn = getIsLoggedIn(state);
    const postData = getCreateRegistrationPostData(state);

    dispatch(clearErrors());
    dispatch(registrationCreateRequest(postData));

    const endpoint = isLoggedIn
      ? 'registration-sale/'
      : 'registration-sale-widget/';

    const storeId = Config.get('storeId');
    let results = await ClaretyApi.post(endpoint, postData, { storeId });
    let result = results[0];

    if (result.status === 'error') {
      dispatch(registrationCreateFailure(result));
      dispatch(setErrors(result.validationErrors));
      return false; 
    }

    if (isLoggedIn) {

      // The auth'd endpoint doesn't return the sale,
      // so we need to make another request to fetch it.

      dispatch(registrationFetchRequest(result.id));

      results = await ClaretyApi.get(`sale/${result.id}`, { storeId });
      result = results[0];

      if (result) {
        dispatch(registrationFetchSuccess(result));
        return true;
      } else {
        throw new Error('[Clarety] Failed to get registration after creating it.');
      }

    } else {
      dispatch(registrationCreateSuccess(result));
      return true;
    }
  };
};

export const submitRegistration = () => {
  return async (dispatch, getState) => {
    const state = getState();
    const postData = getSubmitRegistrationPostData(state);

    dispatch(registrationSubmitRequest(postData));

    const storeId = Config.get('storeId');
    const results = await ClaretyApi.post('registration-payment-widget/', postData, { storeId });
    const result = results[0];

    if (result && result.status !== 'error') {
      // Redirect on success.
      window.location.href = result.redirect;
    } else {
      dispatch(registrationSubmitFailure(result));
      dispatch(setErrors(result.validationErrors));
      return false;
    }
  };
};

export const makePayment = (paymentData, paymentMethod) => {
  return async (dispatch, getState) => {
    const state = getState();

    const postData = {
      saleId: getSaleId(state),

      gatewayToken: "",
      fundraising: {},

      ...paymentData,
    };

    dispatch(registrationSubmitRequest(postData));

    const storeId = Config.get('storeId');
    const results = await ClaretyApi.post('registration-payment/', postData, { storeId });
    const result = results[0];

    if (result && result.status !== 'error') {
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

const registrationCreateRequest = postData => ({
  type: types.registrationCreateRequest,
  postData: postData,
});

const registrationCreateSuccess = result => ({
  type: types.registrationCreateSuccess,
  result,
});

const registrationCreateFailure = result => ({
  type: types.registrationCreateFailure,
  result,
});

// Fetch

const registrationFetchRequest = id => ({
  type: types.registrationFetchRequest,
  id: id,
});

const registrationFetchSuccess = result => ({
  type: types.registrationFetchSuccess,
  result,
});

// Submit

const registrationSubmitRequest = postData => ({
  type: types.registrationSubmitRequest,
  postData: postData,
});

const registrationSubmitFailure = result => ({
  type: types.registrationSubmitFailure,
  result,
});
