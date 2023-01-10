import { getCart, getTrackingData, getRecaptcha, getParsedFormData } from 'shared/selectors';

export const getPaymentPostData = (state) => {
  const cart = getCart(state);
  const formData = getParsedFormData(state);
  const trackingData = getTrackingData(state);
  const recaptcha = getRecaptcha(state);

  const postData = {
    storeUid:  cart.store,
    uid:       cart.uid,
    jwt:       cart.jwt,
    saleline:  cart.items,
    customer:  cart.customer,
    payment:   cart.payment,

    recaptchaResponse: recaptcha,

    ...formData.additionalData,
    ...trackingData,
  };

  return postData;
};
