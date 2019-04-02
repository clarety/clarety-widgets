import { actionTypes } from './types';

export const setErrors = errors => ({
  type: actionTypes.setFormErrors,
  payload: errors,
});

export const clearErrors = () => ({
  type: actionTypes.clearFormErrors,
});
