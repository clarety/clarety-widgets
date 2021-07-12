import { ClaretyApi } from 'clarety-utils';
import { setStatus, setPanelSettings, updateAppSettings, setRecaptcha } from 'shared/actions';
import { getCmsConfirmContent } from 'shared/utils';
import { setErrors, updateFormData } from 'form/actions';
import { executeRecaptcha } from 'form/components';
import { getSubmitCasePostData, getSaveCasePostData, getCmsConfirmContentFields } from 'case/selectors';
import { types } from './types';

export const saveCase = () => {
  return async (dispatch, getState) => {
    dispatch(setStatus('busy-save'));

    const state = getState();

    const recaptcha = await executeRecaptcha();
    dispatch(setRecaptcha(recaptcha));
    if (!recaptcha) return false;

    const postData = getSaveCasePostData(state);
    dispatch(saveCaseRequest(postData));

    const results = await ClaretyApi.post('cases/', postData);
    const result = results[0];

    dispatch(setStatus('ready'));

    if (result.status === 'error') {
      dispatch(saveCaseFailure(result));
      dispatch(setErrors(result.validationErrors));  
      return false;
    } else {
      dispatch(saveCaseSuccess(result));
      dispatch(updateAppSettings({ caseUid: result.caseUid }));
      return true;
    }
  };
};

export const submitCase = () => {
  return async (dispatch, getState) => {
    dispatch(setStatus('busy'));

    const state = getState();
    const { settings } = state;

    const recaptcha = await executeRecaptcha();
    dispatch(setRecaptcha(recaptcha));
    if (!recaptcha) return false;

    const postData = getSubmitCasePostData(state);
    dispatch(submitCaseRequest(postData));

    const results = await ClaretyApi.post('cases/', postData);
    const result = results[0];

    if (result.status === 'error') {
      dispatch(submitCaseFailure(result));
      dispatch(setErrors(result.validationErrors));
      dispatch(setStatus('ready'));
      return false;
    } else {
      dispatch(submitCaseSuccess(result));
      
      if (settings.confirmPageUrl) {
        // Redirect.
        const redirect = result.caseUid
          ? settings.confirmPageUrl + `?caseUid=${result.caseUid}`
          : settings.confirmPageUrl;
        window.location.href = redirect;
      } else {
        // Show CMS confirm content.
        const fields = getCmsConfirmContentFields(state);
        const confirmContent = getCmsConfirmContent(settings.widgetElementId, fields);
        dispatch(setPanelSettings('CmsConfirmPanel', { confirmContent }));
        dispatch(updateAppSettings({ isShowingConfirmation: true }));
        dispatch(setStatus('ready'));

        return true;
      }
    }
  };
};

export const prefillCustomer = () => {
  return async (dispatch, getState) => {
    const results = await ClaretyApi.get('cases/customer');
    const customer = results[0];

    if (customer) {
      // Prefill customer form data.
      for (const key in customer) {
        dispatch(updateFormData(`customer.${key}`, customer[key]));
      }
    }
  };
};

export const prefillInProgressCase = (caseTypeUid, stage) => {
  return async (dispatch, getState) => {
    const results = await ClaretyApi.get('cases/in-progress', { caseTypeUid, stage });
    const caseObj = results[0];

    if (caseObj && caseObj.caseUid) {
      dispatch(updateAppSettings({ caseUid: caseObj.caseUid }));

      for (const key in caseObj.extendFormData) {
        dispatch(updateFormData(`extendFields.${key}`, caseObj.extendFormData[key]));
      }
    }
  };
};

export const saveCaseRequest = (postData) => ({
  type: types.saveCaseRequest,
  postData: postData,
});

export const saveCaseSuccess = (result) => ({
  type: types.saveCaseSuccess,
  result: result,
});

export const saveCaseFailure = (result) => ({
  type: types.saveCaseFailure,
  result: result,
});

export const submitCaseRequest = (postData) => ({
  type: types.submitCaseRequest,
  postData: postData,
});

export const submitCaseSuccess = (result) => ({
  type: types.submitCaseSuccess,
  result: result,
});

export const submitCaseFailure = (result) => ({
  type: types.submitCaseFailure,
  result: result,
});