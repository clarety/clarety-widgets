import { actionTypes } from './types';

export const updatePaymentPanelData = (field, value) => ({
  type: actionTypes.updatePaymentPanelData,
  field,
  value,
});
