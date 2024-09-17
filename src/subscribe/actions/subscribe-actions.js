import { ClaretyApi } from 'shared/utils/clarety-api';
import { setStatus, updateAppSettings, setRecaptcha } from 'shared/actions';
import { setErrors, clearErrors } from 'form/actions';
import { executeRecaptcha } from 'form/components';
import { getSubscribePostData } from 'subscribe/selectors';
import { types } from './types';

export const subscribe = () => {
  return async (dispatch, getState) => {
    dispatch(setStatus('busy'));
    dispatch(clearErrors());

    const state = getState();
    const { settings } = state;

    if (settings.reCaptchaKey) {
      const recaptcha = await executeRecaptcha();
      dispatch(setRecaptcha(recaptcha));
      if (!recaptcha) return false;
    }

    const postData = getSubscribePostData(state);
    dispatch(subscribeRequest(postData));

    const results = await ClaretyApi.post('cases/leads/', postData);
    const result = results[0];

    if (result.status === 'error') {
      dispatch(subscribeFailure(result));
      dispatch(setErrors(result.validationErrors));
      dispatch(setStatus('ready'));
      return false;
    } else {
      dispatch(subscribeSuccess(result));

      if (settings.confirmPageUrl) {
        // Redirect.
        window.location.href = settings.confirmPageUrl;
      } else {
        dispatch(updateAppSettings({ isShowingConfirmation: true }));
        return true;
      }
    }
  };
};

const subscribeRequest = (postData) => ({
  type: types.subscribeRequest,
  postData: postData,
});

const subscribeSuccess = (result) => ({
  type: types.subscribeSuccess,
  result: result,
});

const subscribeFailure = (result) => ({
  type: types.subscribeFailure,
  result: result,
});
