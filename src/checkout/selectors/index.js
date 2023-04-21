import { getSetting, getCart, getPanelManager } from 'shared/selectors';

export const getCartSummaryMode = (state) => {
  const panels = getPanelManager(state);
  const currentPanelIndex = panels.findIndex(panel => panel.status === 'edit');
  const isLastPanel = currentPanelIndex === panels.length - 1;

  return isLastPanel ? 'complete' : 'incomplete';
};

export const hasSelectedShippingOption = (state) => {
  return !!state.formData['sale.shippingUid'];
};

export const getSelectedShippingOptionLabel = (state) => {
  const { shippingOptions } = getCart(state);
  if (!shippingOptions) return '';

  const shippingUid = state.formData['sale.shippingUid'];
  const option = shippingOptions.find(option => option.shippingUid === shippingUid);
  if (!option) return '';

  return option.label;
};

export const getPaymentMethods = (state) => {
  const availableMethods = getSetting(state, 'paymentMethods');
  const allowedMethods = getCart(state).paymentMethods;

  // Return all methods if we don't know which are allowed yet.
  if (!allowedMethods || !allowedMethods.length) {
    return availableMethods;
  }

  // Filter out any methods that aren't allowed.
  return availableMethods.filter(method => allowedMethods.includes(method.type));
};

export const getPaymentMethod = (state, type, gateway = null) => {
  const paymentMethods = getSetting(state, 'paymentMethods');
  return paymentMethods.find(pm => pm.type === type && (!gateway || pm.gateway === gateway));
};

export const hasExpressPaymentMethod = (state) => {
  const paymentMethods = getPaymentMethods(state);
  return paymentMethods && paymentMethods.some(method => method.type === 'wallet');
};

export const getPaymentPostData = (state) => getCart(state).payment;

export const getDonationInCart = (state) => {
  const offerUid = getSetting(state, 'donationOfferUid');
  return getCart(state).items.find(item => item.offerUid === offerUid);
};

export const shouldAllowExpressCheckout = (state) => {
  const cart = getCart(state);
  return cart.allowGuest && hasExpressPaymentMethod(state);
};
