import { types } from 'shared/actions';

export const addItem = ({ offerUid, offerPaymentUid, quantity = 1, price = undefined }) => ({
  type: types.addItem,
  item: {
    offerUid,
    offerPaymentUid,
    quantity,
    price: Number(price),
  },
});

export const clearItems = () => ({
  type: types.clearItems,
});

export const updateCartData = data => ({
  type: types.updateCartData,
  data: data,
});

export const setStore = store => ({
  type: types.setStore,
  store: store,
});

export const setCustomer = customer => ({
  type: types.setCustomer,
  customer: customer,
});

export const setPayment = payment => ({
  type: types.setPayment,
  payment: payment,
});

export const clearPayment = () => ({
  type: types.clearPayment,
});

export const setTracking = ({ sourceId, responseId, emailResponseId }) => ({
  type: types.setTracking,
  sourceId: sourceId,
  responseId: responseId,
  emailResponseId: emailResponseId,
});

export const setRecaptchaResponse = recaptchaResponse => ({
  type: types.setRecaptchaResponse,
  recaptchaResponse: recaptchaResponse,
});
