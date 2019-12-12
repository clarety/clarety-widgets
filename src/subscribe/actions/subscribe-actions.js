import { ClaretyApi } from 'clarety-utils';
import { setStatus, setPanelSettings, updateAppSettings } from 'shared/actions';
import { getSetting } from 'shared/selectors';
import { getCmsConfirmContent } from 'shared/utils';
import { setErrors, clearErrors } from 'form/actions';
import { executeRecaptcha } from 'form/components';
import { getSubscribePostData, getCmsConfirmContentFields } from 'subscribe/selectors';
import { types } from './types';

export const subscribe = () => {
  return async (dispatch, getState) => {
    executeRecaptcha(async () => {
      const state = getState();
      const { settings } = state;

      dispatch(setStatus('busy'));
      dispatch(clearErrors());

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
          // Show CMS confirm content.
          const elementId = getSetting(state, 'widgetElementId');
          const fields = getCmsConfirmContentFields(state);
          const confirmContent = getCmsConfirmContent(elementId, fields);
          dispatch(setPanelSettings('CmsConfirmPanel', { confirmContent }));

          dispatch(updateAppSettings({ isShowingConfirmation: true }));

          return true;
        }
      }
    });
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
