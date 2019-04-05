import { actionTypes } from './types';

export const updateFormData = (field, value) => ({
  type: actionTypes.updateFormData,
  field,
  value,
});
