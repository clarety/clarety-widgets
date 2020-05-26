export const hasSelectedShippingOption = (state) => {
  return !!state.formData['sale.shippingUid'];
};

export const getSelectedShippingOptionLabel = (state) => {
  const { shippingOptions } = state.cart;
  if (!shippingOptions) return '';

  const shippingUid = state.formData['sale.shippingUid'];
  const option = shippingOptions.find(option => option.shippingUid === shippingUid);
  if (!option) return '';

  return option.label;
};

export const getPaymentMethods = (state) => state.cart.paymentMethods;

export const getPaymentMethod = (state, type) => {
  const methods = getPaymentMethods(state);
  return methods.find(method => method.type === type);
};
