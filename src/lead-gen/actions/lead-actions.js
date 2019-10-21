import { parseNestedElements } from 'shared/utils';
import { types } from './types';

export const createLead = () => {
  return async (dispatch, getState) => {
    const { formData } = getState();

    const postData = parseNestedElements(formData);
    dispatch(createLeadRequest(postData));

    // TODO: make api request.
    const result = {};

    if (result.validationErrors) {
      dispatch(createLeadfailure(result));
    } else {
      dispatch(createLeadSuccess(result));
    }
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
