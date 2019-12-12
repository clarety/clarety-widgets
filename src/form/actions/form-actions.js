import { push as pushRoute } from 'connected-react-router';
import { ClaretyApi } from 'clarety-utils';
import { statuses, setStatus } from 'shared/actions';
import { types, setErrors, clearErrors } from 'form/actions';

export const submitForm = (endpoint, formData) => {
  return async (dispatch) => {
    dispatch(formSubmitRequest(endpoint, formData));
    dispatch(setStatus(statuses.busy));
    dispatch(clearErrors());

    const results = await ClaretyApi.post(endpoint, formData);
    const result = results[0];

    if (result.status === 'error') {
      dispatch(formSubmitFailure(result));
      dispatch(setErrors(result.validationErrors));
      dispatch(setStatus(statuses.ready));
    } else {
      dispatch(formSubmitSuccess(result));
      dispatch(pushRoute('/success'));
    }
  };
};

export const formSubmitRequest = (endpoint, formData) => ({
  type: types.formSubmitRequest,
  endpoint: endpoint,
  formData: formData,
});

export const formSubmitSuccess = (result) => ({
  type: types.formSubmitSuccess,
  result: result,
});

export const formSubmitFailure = (result) => ({
  type: types.formSubmitFailure,
  result: result,
});
