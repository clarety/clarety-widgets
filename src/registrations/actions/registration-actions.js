import { ClaretyApi } from 'clarety-utils';
import { getCreateRegistrationPostData, getSubmitRegistrationPostData } from 'registrations/selectors';
import { types, pushPanel, panels } from 'registrations/actions';

export const createRegistration = () => {
  return async (dispatch, getState) => {
    dispatch(registrationCreateRequest());

    const state = getState();
    const postData = getCreateRegistrationPostData(state);

    const result = await ClaretyApi.post('registration-sale-widget/', postData);

    if (result[0] && result[0].status !== 'error') {
      dispatch(registrationCreateSuccess(result[0]));
      dispatch(pushPanel({
        panel: panels.reviewPanel,
        progress: 100,
      }));
    } else {
      dispatch(registrationCreateFailure(result[0]));
    }
  };
};

export const submitRegistration = () => {
  return async (dispatch, getState) => {
    dispatch(registrationSubmitRequest());

    const state = getState();
    const postData = getSubmitRegistrationPostData(state);

    const result = await ClaretyApi.post('registration-payment-widget/', postData);

    if (result[0] && result[0].status !== 'error') {
      // Redirect on success.
      window.location.href = result[0].redirect;
    } else {
      dispatch(registrationSubmitFailure(result[0]));
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
