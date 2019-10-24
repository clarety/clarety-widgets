import { ClaretyApi } from 'clarety-utils';
import { setStatus, setPanelSettings } from 'shared/actions';
import { getSetting } from 'shared/selectors';
import { getCmsConfirmContent } from 'shared/utils';
import { setErrors } from 'form/actions';
import { executeRecaptcha } from 'form/components';
import { getLeadPostData, getCmsConfirmContentFields } from 'lead-gen/selectors';
import { types } from './types';

export const createLead = () => {
  return async (dispatch, getState) => {
    // executeRecaptcha(async () => {
      const state = getState();

      dispatch(setStatus('busy'));

      const postData = getLeadPostData(state);
      dispatch(createLeadRequest(postData));

      const results = await ClaretyApi.post('cases/lead/', postData);
      const result = results[0];

      if (result.status === 'error') {
        dispatch(createLeadFailure(result));
        dispatch(setErrors(result.validationErrors));
        dispatch(setStatus('ready'));
        return false;
      } else {
        dispatch(createLeadSuccess(result));

        // TODO: update sos count...
        // dispatch(incrementSosCounter());
        
        if (state.settings.confirmPageUrl) {
          // Redirect.
          window.location.href = state.settings.confirmPageUrl;
        } else {
          // Show CMS confirm content.
          const elementId = getSetting(state, 'widgetElementId');
          const fields = getCmsConfirmContentFields(state);
          const confirmContent = getCmsConfirmContent(elementId, fields);
          dispatch(setPanelSettings('CmsConfirmPanel', { confirmContent }));

          return true;
        }
      }
    // });
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
