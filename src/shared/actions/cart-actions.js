import uuid from 'uuid/v4';
import { types } from 'shared/actions';

export const addItem = ({ offerId, offerUid, offerPaymentUid, offerProductId, type, quantity, price, panel, options, description }) => ({
  type: types.addItem,
  item: {
    offerId: offerId,
    offerUid: offerUid,
    offerPaymentUid: offerPaymentUid,
    offerProductId: offerProductId,
    quantity: quantity || 1,
    price: Number(price),
    description: description,

    type: type,
    panel: panel,
    options: options || {},

    appRef: uuid(),
  },
});

export const updateItem = (index, item) => ({
  type: types.updateItem,
  index: index,
  item: item,
});

export const removeItem = (index) => ({
  type: types.removeItem,
  index: index,
});

export const removeItemsWithPanel = (panel) => ({
  type: types.removeItemsWithPanel,
  panel: panel,
});

export const removeItemsWithType = (type) => ({
  type: types.removeItemsWithType,
  itemType: type,
});

export const clearItems = () => ({
  type: types.clearItems,
});

export const updateCartData = (data) => ({
  type: types.updateCartData,
  data: data,
});

export const setStore = (store) => ({
  type: types.setStore,
  store: store,
});

export const setCustomer = (customer) => ({
  type: types.setCustomer,
  customer: customer,
});

export const setOrganisation = (organisation) => ({
  type: types.setOrganisation,
  organisation: organisation,
});

export const setPayment = (payment) => ({
  type: types.setPayment,
  payment: payment,
});

export const clearPayment = () => ({
  type: types.clearPayment,
});

export const setPromoCode = (promoCode) => ({
  type: types.setPromoCode,
  promoCode: promoCode,
});

export const setTrackingData = ({ sourceId, sourceUid, responseId, emailResponseId }) => ({
  type: types.setTrackingData,
  sourceId: sourceId,
  sourceUid: sourceUid,
  responseId: responseId,
  emailResponseId: emailResponseId,
});

export const setRecaptcha = (recaptcha) => ({
  type: types.setRecaptcha,
  recaptcha: recaptcha,
});
