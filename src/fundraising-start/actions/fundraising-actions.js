import { ClaretyApi } from 'clarety-utils';
import { setStatus } from 'shared/actions';
import { setErrors } from 'form/actions';
import { getSettings } from 'shared/selectors';
import { getCampaignPostData } from 'fundraising-start/selectors';
import { types } from './types';

export const createCampaign = () => {
  return async (dispatch, getState) => {
    const state = getState();
    const settings = getSettings(state);

    dispatch(setStatus('busy'));

    const postData = getCampaignPostData(state);
    dispatch(createCampaignRequest(postData));

    const results = await ClaretyApi.post('fundraising/pages/', postData);
    const result = results[0];

    if (result.status === 'error') {
      dispatch(createCampaignFailure(result));
      dispatch(setErrors(result.validationErrors));
      dispatch(setStatus('ready'));
      return false;
    } else {
      dispatch(createCampaignSuccess(result));
      
      // Redirect on success.
      window.location.href = `${settings.confirmPageUrl}?pageUid=${result.pageUid}`;
    }
  };
};

// Create Campaign

export const createCampaignRequest = (postData) => ({
  type: types.createCampaignRequest,
  postData: postData,
});

export const createCampaignSuccess = (result) => ({
  type: types.createCampaignSuccess,
  result: result,
});

export const createCampaignFailure = (result) => ({
  type: types.createCampaignFailure,
  result: result,
});
