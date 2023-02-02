import { ClaretyApi } from 'clarety-utils';
import { setStatus, setPanelSettings, setPanelStatus, updateAppSettings, setRecaptcha } from 'shared/actions';
import { appendQueryString, getCmsConfirmContent } from 'shared/utils';
import { getPanelManager, isNextPanelCmsConfirm, getCurrentPanelIndex, getSetting } from 'shared/selectors';
import { setErrors, updateFormData } from 'form/actions';
import { executeRecaptcha } from 'form/components';
import { getErrors } from 'form/selectors';
import { getSubmitCasePostData, getSaveCasePostData, getCmsConfirmContentFields } from 'case/selectors';
import { walkFlattenedKeys } from 'case/utils';
import { types } from './types';

export const saveCase = () => {
  return async (dispatch, getState) => {
    dispatch(setStatus('busy-save'));

    const state = getState();
    const { settings } = state;

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
      dispatch(jumpToFirstPanelWithError());
      return false;
    } else {
      dispatch(saveCaseSuccess(result));

      if (settings.saveConfirmPageUrl) {
        // Redirect.
        window.location.href = appendQueryString(settings.saveConfirmPageUrl, { caseUid: result.caseUid });
      } else {
        // Show alert.
        dispatch(updateAppSettings({ caseUid: result.caseUid }));
        alert(t('case-form-saved', 'Your progress has been saved. Return to this page at any time to continue.'));
      }

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
      dispatch(jumpToFirstPanelWithError());
      dispatch(setStatus('ready'));
      return false;
    } else {
      dispatch(submitCaseSuccess(result));
      
      if (settings.confirmPageUrl) {
        // Redirect.
        window.location.href = appendQueryString(settings.confirmPageUrl, { caseUid: result.caseUid });
        return false;
      } else {
        // Show confirm content.
        if (isNextPanelCmsConfirm(state)) {
          const fields = getCmsConfirmContentFields(state);
          const confirmContent = getCmsConfirmContent(settings.widgetElementId, fields);
          dispatch(setPanelSettings('CmsConfirmPanel', { confirmContent }));
        }

        dispatch(updateAppSettings({ isShowingConfirmation: true }));
        dispatch(setStatus('ready'));
        return true;
      }
    }
  };
};

export const jumpToPanelForSection = (section) => {
  return async (dispatch, getState) => {
    const state = getState();
    const panels = getPanelManager(state);

    // 'wait' all panels after the section we're jumping to.
    panels.forEach((panel, index) => {
      if (panel.data.section !== undefined) {
        if (panel.data.section > section || (section === 'customer' && panel.data.section !== 'customer')) {
          dispatch(setPanelStatus(index, 'wait'));
        }
      }
    });

    // 'edit' the panel with the section we're jumping to.
    const nextPanelIndex = panels.findIndex(panel => panel.data.section === section);
    dispatch(setPanelStatus(nextPanelIndex, 'edit'));
  }
};

const jumpToFirstPanelWithError = () => {
  return async (dispatch, getState) => {
    const state = getState();
    const errors = getErrors(state);
    const panels = getPanelManager(state);
    const extendForm = getSetting(state, 'extendForm');

    const jumpToPanelIndex = getFirstPanelIndexWithError(errors, panels, extendForm);
    if (jumpToPanelIndex) {
      const currentPanelIndex = getCurrentPanelIndex(state);
      dispatch(setPanelStatus(currentPanelIndex, 'wait'));
      dispatch(setPanelStatus(jumpToPanelIndex, 'edit'));
    }
  };
};

function getFirstPanelIndexWithError(errors, panels, extendForm) {
  for (const error of errors) {
    if (!error.field) continue;

    for (const [panelIndex, panel] of panels.entries()) {
      if (panel.component !== 'CaseFormPanel') continue;
      if (typeof panel.data.section !== 'number') continue;

      const section = extendForm.sections[panel.data.section];
      for (const field of section.extendFields) {
        if (`extendFields.${field.columnKey}` === error.field) {
          return panelIndex;
        }
      }
    }
  }

  return null;
}

export const prefillCustomer = () => {
  return async (dispatch, getState) => {
    const results = await ClaretyApi.get('cases/customer');
    const customer = results[0];

    if (customer) {
      // Prefill customer form data.
      walkFlattenedKeys(customer, (key, value) => dispatch(updateFormData(key, value)), 'customer.');
      dispatch(updateAppSettings({ fetchedCustomer: true }));
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
