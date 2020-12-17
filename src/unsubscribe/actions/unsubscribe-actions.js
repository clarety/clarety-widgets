import { ClaretyApi } from 'clarety-utils';
import { setStatus, updateAppSettings, setRecaptcha } from 'shared/actions';
import { setErrors, clearErrors } from 'form/actions';
import { executeRecaptcha } from 'form/components';
import { getUnsubscribePostData } from 'unsubscribe/selectors';
import { types } from './types';

export const unsubscribe = () => {
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

    const postData = getUnsubscribePostData(state);

    dispatch(unsubscribeRequest(postData));

    const results = await ClaretyApi.post('unsubscribe/', postData);
    const result = results[0];

    if (result.status === 'error') {
      dispatch(unsubscribeFailure(result));
      dispatch(setErrors(result.validationErrors));
      dispatch(setStatus('ready'));
      return false;
    } else {
      dispatch(unsubscribeSuccess(result));

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

const unsubscribeRequest = (postData) => ({
  type: types.unsubscribeRequest,
  postData: postData,
});

const unsubscribeSuccess = (result) => ({
  type: types.unsubscribeSuccess,
  result: result,
});

const unsubscribeFailure = (result) => ({
  type: types.unsubscribeFailure,
  result: result,
});
