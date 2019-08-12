import { types } from '.';

export const updateFormData = formData => ({
  type: types.updateFormData,
  formData: formData,
});

export const resetFormData = () => ({
  type: types.resetFormData,
});
