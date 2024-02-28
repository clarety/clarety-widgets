import { ClaretyApi } from 'clarety-utils';
import { setStatus, setPanelSettings, updateAppSettings, setRecaptcha } from 'shared/actions';
import { getSetting, isNextPanelCmsConfirm } from 'shared/selectors';
import { getCmsConfirmContent } from 'shared/utils';
import { setErrors } from 'form/actions';
import { executeRecaptcha } from 'form/components';
import { getLeadPostData, getCmsConfirmContentFields } from 'lead-gen/selectors';
import { types } from './types';

export const createLead = () => {
  return async (dispatch, getState) => {
    dispatch(setStatus('busy'));

    const state = getState();
    const { settings } = state;

    const recaptcha = await executeRecaptcha();
    dispatch(setRecaptcha(recaptcha));
    if (!recaptcha) return false;

    const postData = getLeadPostData(state);
    dispatch(createLeadRequest(postData));

    const results = await ClaretyApi.post('cases/leads/', postData);
    const result = results[0];

    if (result.status === 'error') {
      dispatch(createLeadFailure(result));
      dispatch(setErrors(result.validationErrors));
      dispatch(setStatus('ready'));
      return false;
    } else {
      dispatch(createLeadSuccess(result));

      // Sos.
      if (settings.variant === 'sos') {
        dispatch(incrementSosCounter());
      }
      
      // Download.
      if (settings.variant === 'download') {
        if (!settings.download || !settings.download.file) {
          console.log('Missing download file setting');
        } else {
          window.open(settings.download.file);
        }
      }
      
      if (settings.confirmPageUrl) {
        // Redirect.
        
        const url = new URL(settings.confirmPageUrl);
        if (result.caseUid) {
          url.searchParams.append('caseUid', result.caseUid);
        }
        if (result.actionAuthKey) {
          url.searchParams.append('clarety_action', result.actionAuthKey);
        }

        window.location.href = url.href;

        return false;
      } else {
        // Show CMS confirm content.
        if (isNextPanelCmsConfirm(state)) {
          const elementId = getSetting(state, 'widgetElementId');
          const fields = getCmsConfirmContentFields(state);
          const confirmContent = getCmsConfirmContent(elementId, fields);
          dispatch(setPanelSettings('CmsConfirmPanel', { confirmContent }));
        }

        dispatch(updateAppSettings({ isShowingConfirmation: true }));
        return true;
      }
    }
  };
};

export const incrementSosCounter = () => {
  return async (dispatch, getState) => {
    const state = getState();

    const sos = getSetting(state, 'sos');

    dispatch(updateAppSettings({
      sos: {
        ...sos,
        current: sos.current + 1,
      }
    }));
  };
};


export const createLeadRequest = (postData) => ({
  type: types.createLeadRequest,
  postData: postData,
});

export const createLeadSuccess = (result) => ({
  type: types.createLeadSuccess,
  result: result,
});

export const createLeadFailure = (result) => ({
  type: types.createLeadFailure,
  result: result,
});
