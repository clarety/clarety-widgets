export const hasSelectedShippingOption = (state) => {
  return !!state.formData['sale.shippingOption'];
};

export const getSelectedShippingOptionLabel = (state) => {
  const { shippingOptions, sale } = state.cart;

  if (shippingOptions && sale) {
    const option = shippingOptions.find(option => option.uid === sale.shippingOption);

    if (option) return option.label;
  }

  return '';
};

export const getPaymentMethods = (state) => state.cart.paymentMethods;

export const getPaymentMethod = (state, type) => {
  const methods = getPaymentMethods(state);
  return methods.find(method => method.type === type);
};
