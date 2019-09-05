import { push as pushRoute } from 'connected-react-router';
import { ClaretyApi } from 'clarety-utils';
import { statuses, setStatus } from 'shared/actions';
import { updateFormData, setErrors, clearErrors } from 'form/actions';

export const submitDetailsPanel = () => {
  return async (dispatch, getState) => {
    const { status, formData, cart } = getState();

    if (status !== statuses.ready) return;

    dispatch(setStatus(statuses.busy));
    dispatch(clearErrors());

    const postData = {
      ...formData,
      saleline: cart.salelines[0],
    };
    
    const results = await ClaretyApi.post('donations/', postData);
    const result = results[0];

    dispatch(setStatus(statuses.ready));

    if (result.validationErrors) {
      dispatch(setErrors(result.validationErrors));
    } else {
      dispatch(updateFormData('uid', result.uid));
      dispatch(updateFormData('jwt', result.jwt));
      dispatch(pushRoute('/payment'));
    }
  };
};
