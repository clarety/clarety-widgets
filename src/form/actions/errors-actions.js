import { types } from './types';

export const setErrors = errors => ({
  type: types.setErrors,
  errors,
});

export const clearErrors = () => ({
  type: types.clearErrors,
});
