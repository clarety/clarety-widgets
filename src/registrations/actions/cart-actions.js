import { ClaretyApi, Config } from 'clarety-utils';
import { getCreateRegistrationPostData, getSubmitRegistrationPostData } from 'registrations/selectors';
import { types, pushPanel, panels, setErrors } from 'registrations/actions';

export const createRegistration = () => {
  return async (dispatch, getState) => {
    dispatch(registrationCreateRequest());

    const storeId = Config.get('storeId');

    const state = getState();
    const postData = getCreateRegistrationPostData(state);

    const results = await ClaretyApi.post('registration-sale-widget/', postData, { storeId });
    const result = results[0];

    if (result.status === 'error') {
      dispatch(registrationCreateFailure(result));
      dispatch(setErrors(result.validationErrors));
    } else {
      dispatch(registrationCreateSuccess(result));
    }

    dispatch(pushPanel({
      panel: panels.reviewPanel,
      progress: 100,
    }));
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

    if (result.status === 'error') {
      dispatch(registrationSubmitFailure(result));
      dispatch(setErrors(result.validationErrors));
    } else {
      // Redirect on success.
      window.location.href = result[0].redirect;
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
