import { types } from 'checkout/actions';

export const setErrors = errors => ({
  type: types.setErrors,
  errors: errors,
});
