import { ClaretyApi, Config } from 'clarety-utils';
import { getCreateRegistrationPostData, getSubmitRegistrationPostData } from 'registrations/selectors';
import { types, pushPanel, panels, setErrors } from 'registrations/actions';

export const createRegistration = () => {
  return async (dispatch, getState) => {
    const state = getState();
    const postData = getCreateRegistrationPostData(state);

    dispatch(registrationCreateRequest(postData));

    const storeId = Config.get('storeId');
    const results = await ClaretyApi.post('registration-sale-widget/', postData, { storeId });
    const result = results[0];

    if (result.status === 'error') {
      dispatch(registrationCreateFailure(result));
      dispatch(setErrors(result.validationErrors));
    } else {
      dispatch(registrationCreateSuccess(result));
    }

    dispatch(pushPanel({
      name: panels.reviewPanel,
      data: {
        progress: 100,
      }
    }));
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

const registrationCreateRequest = postData => ({
  type: types.registrationCreateRequest,
  postData: postData,
});

const registrationCreateSuccess = result => ({
  type: types.registrationCreateSuccess,
  result: result,
});

const registrationCreateFailure = result => ({
  type: types.registrationCreateFailure,
  result: result,
});


// Submit

const registrationSubmitRequest = postData => ({
  type: types.registrationSubmitRequest,
  postData: postData,
});

const registrationSubmitFailure = result => ({
  type: types.registrationSubmitFailure,
  result: result,
});
