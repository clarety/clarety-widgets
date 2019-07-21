import { push as pushRoute } from 'connected-react-router';
import { ClaretyApi } from 'shared/services';
import { statuses, setStatus } from 'shared/actions';
import { types, setErrors, clearErrors } from 'form/actions';

export const submitForm = (endpoint, formData) => {
  return async dispatch => {
    dispatch(formSubmitRequest(endpoint, formData));
    dispatch(setStatus(statuses.busy));
    dispatch(clearErrors());

    const result = await ClaretyApi.post(endpoint, formData);

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

const formSubmitRequest = (endpoint, formData) => ({
  type: types.formSubmitRequest,
  endpoint,
  formData,
});

const formSubmitSuccess = result => ({
  type: types.formSubmitSuccess,
  result,
});

const formSubmitFailure = result => ({
  type: types.formSubmitFailure,
  result,
});
