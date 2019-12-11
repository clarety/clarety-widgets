import { ClaretyApi } from 'clarety-utils';
import { setStatus, setPanelSettings, updateAppSettings } from 'shared/actions';
import { getSetting } from 'shared/selectors';
import { getCmsConfirmContent } from 'shared/utils';
import { setErrors, clearErrors, formSubmitRequest, formSubmitSuccess, formSubmitFailure } from 'form/actions';
import { executeRecaptcha } from 'form/components';
import { getSubscribePostData, getCmsConfirmContentFields } from 'subscribe/selectors';

export const subscribe = () => {
  return async (dispatch, getState) => {
    // executeRecaptcha(async () => {
      const state = getState();
      const { settings } = state;

      dispatch(setStatus('busy'));
      dispatch(clearErrors());

      const postData = getSubscribePostData(state);
      dispatch(formSubmitRequest('cases/leads/', postData));

      const results = await ClaretyApi.post('cases/leads/', postData);
      const result = results[0];

      if (result.status === 'error') {
        dispatch(formSubmitFailure(result));
        dispatch(setErrors(result.validationErrors));
        dispatch(setStatus('ready'));
        return false;
      } else {
        dispatch(formSubmitSuccess(result));

        if (settings.confirmPageUrl) {
          // Redirect.
          // TODO: set 'jwtConfirm' cookie?
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
    // });
  };
};
