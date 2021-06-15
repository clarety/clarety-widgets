import { ClaretyApi } from 'clarety-utils';
import { setStatus, setPanelSettings, updateAppSettings, setRecaptcha } from 'shared/actions';
import { getSetting } from 'shared/selectors';
import { getCmsConfirmContent } from 'shared/utils';
import { setErrors } from 'form/actions';
import { executeRecaptcha } from 'form/components';
import { getCasePostData } from 'case/selectors';
import { types } from './types';

export const createCase = () => {
  return async (dispatch, getState) => {
    dispatch(setStatus('busy'));

    const state = getState();

    const recaptcha = await executeRecaptcha();
    dispatch(setRecaptcha(recaptcha));
    if (!recaptcha) return false;

    const postData = getCasePostData(state);
    dispatch(createCaseRequest(postData));

    const results = await ClaretyApi.post('cases/', postData);
    const result = results[0];

    if (result.status === 'error') {
      dispatch(createCaseFailure(result));
      dispatch(setErrors(result.validationErrors));
      dispatch(setStatus('ready'));
      return false;
    } else {
      dispatch(createCaseSuccess(result));
      
      if (settings.confirmPageUrl) {
        // Redirect.
        const redirect = result.caseUid
          ? settings.confirmPageUrl + `?caseUid=${result.caseUid}`
          : settings.confirmPageUrl;
        window.location.href = redirect;
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
  };
};

export const createCaseRequest = (postData) => ({
  type: types.createCaseRequest,
  postData: postData,
});

export const createCaseSuccess = (result) => ({
  type: types.createCaseSuccess,
  result: result,
});

export const createCaseFailure = (result) => ({
  type: types.createCaseFailure,
  result: result,
});
