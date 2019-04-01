import { actionTypes } from './types';

export const setAmountPanelFormData = formData => ({
  type: actionTypes.setAmountPanelFormData,
  payload: formData,
});
