import { ClaretyApi, Config } from 'clarety-utils';
import { setErrors } from 'form/actions';
import { getCreateRegistrationPostData, getSubmitRegistrationPostData } from 'registrations/selectors';
import { types, pushPanel, panels } from 'registrations/actions';

export const createRegistration = () => {
  return async (dispatch, getState) => {
    dispatch(registrationCreateRequest());

    const storeId = Config.get('storeId');

    const state = getState();
    const postData = getCreateRegistrationPostData(state);

    const results = await ClaretyApi.post('registration-sale-widget/', postData, { storeId });
    const result = results[0];

    if (result.status !== 'error') {
      dispatch(registrationCreateSuccess(result));
      dispatch(pushPanel({
        panel: panels.reviewPanel,
        progress: 100,
      }));
    } else {
      dispatch(registrationCreateFailure(result));
      dispatch(setErrors(result.validationErrors));
    }
  };
};

export const submitRegistration = () => {
  return async (dispatch, getState) => {
    dispatch(registrationSubmitRequest());

    const storeId = Config.get('storeId');

    const state = getState();
    const postData = getSubmitRegistrationPostData(state);

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

const registrationCreateRequest = () => ({
  type: types.registrationCreateRequest,
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

const registrationSubmitRequest = () => ({
  type: types.registrationSubmitRequest,
});

const registrationSubmitFailure = result => ({
  type: types.registrationSubmitFailure,
  result,
});
