import { actionTypes } from './types';

export const updatePaymentData = (field, value) => ({
  type: actionTypes.updatePaymentData,
  field,
  value,
});
