import actionTypes from './types';

export const setValidationErrors = errors => ({
  type: actionTypes.setFormValidationErrors,
  payload: errors,
});

export const clearValidationErrors = () => ({
  type: actionTypes.clearFormValidationErrors,
});
