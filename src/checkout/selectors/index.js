export const getIsLoggedIn = state => {
  const { auth, cart } = state;
  return !!(auth.jwt && cart.customer);
};

export const getEmailStatus = (state, panelIndex) => {
  const panel = state.panels[panelIndex];
  return panel.data.emailStatus;
};

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
