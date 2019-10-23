import { ClaretyApi } from 'clarety-utils';
import { executeRecaptcha } from 'form/components';
import { getLeadPostData } from 'lead-gen/selectors';
import { types } from './types';

export const createLead = () => {
  return async (dispatch, getState) => {
    // executeRecaptcha(async () => {
      const state = getState();

      const postData = getLeadPostData(state);
      dispatch(createLeadRequest(postData));

      const results = await ClaretyApi.post('cases/lead/', postData);
      const result = results[0];

      if (result.status === 'error') {
        dispatch(createLeadFailure(result));
      } else {
        dispatch(createLeadSuccess(result));

        // Redirect on success.
        if (state.settings.confirmPageUrl) {
          window.location.href = state.settings.confirmPageUrl;
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
