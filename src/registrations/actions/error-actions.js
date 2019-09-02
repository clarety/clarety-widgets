import { types } from 'registrations/actions';

export const setErrors = errors => ({
  type: types.setErrors,
  errors: errors,
});
