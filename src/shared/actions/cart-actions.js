import uuid from 'uuid/v4';
import { ClaretyApi } from 'shared/utils/clarety-api';
import { getTrackingData } from 'shared/selectors';
import { types } from 'shared/actions';

export const addItem = ({ offerId, offerUid, offerPaymentUid, productId, type, quantity, price, panel, options, description }) => ({
  type: types.addItem,
  item: {
    offerId: offerId,
    offerUid: offerUid,
    offerPaymentUid: offerPaymentUid,
    productId: productId,
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

export const updateCustomer = (customer) => ({
  type: types.updateCustomer,
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

export const setTrackingData = (trackingData) => ({
  type: types.setTrackingData,
  trackingData: trackingData,
});

export const initTrackingData = (widgetProps) => {
  const urlParams = new URLSearchParams(window.location.search);

  return {
    type: types.setTrackingData,
    trackingData: {
      channel:          widgetProps.channel,
      sourceId:         widgetProps.sourceId,
      sourceUid:        widgetProps.sourceUid,
      sourceAdditional: widgetProps.sourceAdditional,
      sendResponseUid:  widgetProps.responseId,
      emailResponseUid: widgetProps.emailResponseId || urlParams.get('clarety_source'),
      sourceUrl:        window.location.href,
      utm: {
        utm_campaign: urlParams.get('utm_campaign'),
        utm_source: urlParams.get('utm_source'),
        utm_medium: urlParams.get('utm_medium'),
        utm_term: urlParams.get('utm_term'),
        utm_content: urlParams.get('utm_content'),
      },
      ...widgetProps.tracking,
    },
  };
};

export const setRecaptcha = (recaptcha) => ({
  type: types.setRecaptcha,
  recaptcha: recaptcha,
});

export const clearRecaptcha = () => ({
  type: types.clearRecaptcha,
});

export const setTurnstileToken = (turnstileToken) => ({
  type: types.setTurnstileToken,
  turnstileToken: turnstileToken,
});

export const setApiCampaignUids = () => {
  return async (dispatch, getState) => {
    const state = getState();
    const trackingData = getTrackingData(state);
    const { emailResponseUid, sendResponseUid } = trackingData;
    if (emailResponseUid) ClaretyApi.setHeader('emailResponseUid', emailResponseUid);
    if (sendResponseUid)  ClaretyApi.setHeader('sendResponseUid', sendResponseUid);
  };
};
