import { getSetting, getCart } from 'shared/selectors';

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
  return availableMethods.filter(availableMethod => {
    return !!allowedMethods.find(allowedMethod => allowedMethod.type === availableMethod.type);
  });
};

export const getPaymentMethod = (state, type) => {
  const paymentMethods = getSetting(state, 'paymentMethods');
  return paymentMethods.find(method => method.type === type);
};

export const getPaymentPostData = (state) => getCart(state).payment;
