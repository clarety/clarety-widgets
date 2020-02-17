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

export const getPaymentMethods = state => state.cart.paymentMethods;

const getLoginPanel = state => {
  return state.panels.loginPanel;
};
