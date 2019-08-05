import { types } from '.';

export const updateFormData = formData => ({
  type: types.updateFormData,
  formData: formData,
});
