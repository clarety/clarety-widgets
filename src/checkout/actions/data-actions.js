import { types } from '.';

export const updateFormData = formData => ({
  type: types.updateFormData,
  formData: formData,
});

export const updatePaymentData = paymentData => ({
  type: types.updatePaymentData,
  paymentData: paymentData,
});
