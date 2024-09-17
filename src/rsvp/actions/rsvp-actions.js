import Cookies from 'js-cookie';
import { ClaretyApi } from 'shared/utils/clarety-api';
import { setStatus, setRecaptcha } from 'shared/actions';
import { setErrors } from 'form/actions';
import { executeRecaptcha } from 'form/components';
import { getRsvpPostData } from 'rsvp/selectors';
import { types } from './types';

export const createRsvp = () => {
  return async (dispatch, getState) => {
    dispatch(setStatus('busy'));

    const state = getState();
    const { settings } = state;

    const recaptcha = await executeRecaptcha();
    dispatch(setRecaptcha(recaptcha));
    if (!recaptcha) return false;

    const postData = getRsvpPostData(state);
    dispatch(createRsvpRequest(postData));

    const results = await ClaretyApi.post('events/rsvp/', postData);
    const result = results[0];

    if (result.status === 'error') {
      dispatch(createRsvpFailure(result));
      dispatch(setErrors(result.validationErrors));
      dispatch(setStatus('ready'));
      return false;
    } else {
      dispatch(createRsvpSuccess(result));

      // Redirect on success.
      Cookies.set('session-jwt', result.jwt);
      window.location.href = settings.confirmPageUrl || 'event-rsvp-confirm.php';
    }
  };
};


const createRsvpRequest = (postData) => ({
  type: types.createRsvpRequest,
  postData: postData,
});

const createRsvpSuccess = (result) => ({
  type: types.createRsvpSuccess,
  result: result,
});

const createRsvpFailure = (result) => ({
  type: types.createRsvpFailure,
  result: result,
});
