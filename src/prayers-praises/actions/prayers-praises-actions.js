import { ClaretyApi } from 'clarety-utils';
import { setStatus, setPanelSettings, updateAppSettings, setRecaptcha } from 'shared/actions';
import { getSetting } from 'shared/selectors';
import { getCmsConfirmContent } from 'shared/utils';
import { setErrors } from 'form/actions';
import { executeRecaptcha } from 'form/components';
import { getPrayerPraisePostData, getCmsConfirmContentFields } from 'prayer-praises/selectors';
import { types } from './types';

export const createPrayerPraise = () => {
  return async (dispatch, getState) => {
    dispatch(setStatus('busy'));

    const state = getState();
    const { settings } = state;

    const recaptcha = await executeRecaptcha();
    dispatch(setRecaptcha(recaptcha));
    if (!recaptcha) return false;

    const postData = getPrayerPraisePostData(state);
    dispatch(createPrayerPraiseRequest(postData));

    const results = await ClaretyApi.post('cases/prayerspraies/', postData);
    const result = results[0];

    if (result.status === 'error') {
      dispatch(createPrayerPraiseFailure(result));
      dispatch(setErrors(result.validationErrors));
      dispatch(setStatus('ready'));
      return false;
    } else {
      dispatch(createPrayerPraiseSuccess(result));

      if (settings.confirmPageUrl) {
        // Redirect.
        // TODO: replace url param with jwt session cookie.
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

export const createPrayerPraiseRequest = (postData) => ({
  type: types.createPrayerPraiseRequest,
  postData: postData,
});

export const createPrayerPraiseSuccess = (result) => ({
  type: types.createPrayerPraiseSuccess,
  result: result,
});

export const createPrayerPraiseFailure = (result) => ({
  type: types.createPrayerPraiseFailure,
  result: result,
});
