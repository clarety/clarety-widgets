import { actionTypes } from './types';

export const setErrors = errors => ({
  type: actionTypes.setErrors,
  errors,
});

export const clearErrors = () => ({
  type: actionTypes.clearErrors,
});
