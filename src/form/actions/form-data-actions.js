import { types } from 'form/actions';

export const setFormData = formData => ({
  type: types.setFormData,
  formData: formData,
});

export const updateFormData = (field, value) => ({
  type: types.updateFormData,
  field: field,
  value: value,
});

export const resetFormData = () => ({
  type: types.resetFormData,
});
