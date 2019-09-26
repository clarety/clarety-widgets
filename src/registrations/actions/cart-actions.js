import { ClaretyApi, Config } from 'clarety-utils';
import { setErrors } from 'form/actions';
import { getCreateRegistrationPostData, getSubmitRegistrationPostData } from 'registrations/selectors';
import { types } from 'registrations/actions';

export const createRegistration = () => {
  return async (dispatch, getState) => {
    const state = getState();
    const postData = getCreateRegistrationPostData(state);

    dispatch(registrationCreateRequest(postData));

    const storeId = Config.get('storeId');
    const results = await ClaretyApi.post('registration-sale-widget/', postData, { storeId });
    const result = results[0];

    if (result.status !== 'error') {
      dispatch(registrationCreateSuccess(result));
      return true;
    } else {
      dispatch(registrationCreateFailure(result));
      dispatch(setErrors(result.validationErrors));
      return false;
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


// Submit

const registrationSubmitRequest = postData => ({
  type: types.registrationSubmitRequest,
  postData: postData,
});

const registrationSubmitFailure = result => ({
  type: types.registrationSubmitFailure,
  result,
});
