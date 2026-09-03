import { getSetting, getFormData, getCart, getTrackingData, getRecaptcha } from 'shared/selectors';

const getSelectedSalelinePaymentUids = (state) => {
  const formData = getFormData(state);
  return formData['salelinePaymentUids'] || [];
};

export const getSelectedDonations = (state) => {
  const salelinePaymentUids = getSelectedSalelinePaymentUids(state);

  const recurringDonations = getSetting(state, 'recurringDonations') || [];
  return recurringDonations.filter((recurringDonation) => salelinePaymentUids.includes(recurringDonation.salelinePaymentUid));
};

export const getUpdatePaymentDetailsPostData = (state) => {
  const cart = getCart(state);
  const formData = getFormData(state);

  return {
    storeUid: cart.store,
    salelinePaymentUids: getSelectedSalelinePaymentUids(state),
    catchUpAmount: formData['catchUpAmount'],
    payment: cart.payment,
    recaptchaResponse: getRecaptcha(state),
    ...getTrackingData(state),
  };
};
