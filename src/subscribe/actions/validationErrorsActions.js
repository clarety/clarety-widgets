import actionTypes from './types';

export const setValidationErrors = errors => ({
  type: actionTypes.setValidationErrors,
  payload: errors,
});

export const clearValidationErrors = () => ({
  type: actionTypes.clearValidationErrors,
});
