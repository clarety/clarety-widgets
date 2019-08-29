export const getPanelData = (state, index) => state.panels[index].data;

export const hasSelectedShippingOption = state => {
  return !!state.formData['sale.shippingOption'];
};

export const getSelectedShippingOptionLabel = state => {
  const { shippingOptions, sale } = state.cart;

  if (shippingOptions && sale) {
    const option = shippingOptions.find(option => option.uid === sale.shippingOption);

    if (option) return option.label;
  }

  return '';
};

export const getPaymentMethod = state => {
  const { paymentMethods } = state.cart;
  if (!paymentMethods) return null;
  // TODO: handle multiple payment methods.
  return paymentMethods[0];
};
