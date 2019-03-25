import actionTypes from './types';

export const updateData = (field, value) => ({
  type: actionTypes.updateFormData,
  payload: { field, value },
});
