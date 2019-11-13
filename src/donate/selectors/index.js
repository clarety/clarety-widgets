import { statuses } from 'shared/actions';
import { getCart, getTrackingData, getRecaptcha, getSettings, getParsedFormData } from 'shared/selectors';

export function getIsBusy(state) {
  return state.status !== statuses.ready;
}

export function getCartItem(state) {
  return state.cart.items[0];
}

export function getSelectedFrequency(state) {
  return state.panels.amountPanel.frequency;
}

export function getSelectedAmount(state) {
  const { amountPanel } = state.panels;
  const { currency } = state.settings;

  const selection = amountPanel.selections[amountPanel.frequency];

  if (!selection) return '';
  if (!selection.amount) return '';

  const amount = Number(selection.amount).toFixed(2);
  return currency.symbol + amount;
}

export function getFrequencyLabel(state, offerUid) {
  for (let offer of state.settings.offers) {
    if (offer.offerUid === offerUid) return offer.label;
  }

  return '';
}

export function getAmountPanelSelection(state) {
  const { amountPanel } = state.panels;
  return amountPanel.selections[amountPanel.frequency];
}

export function getSelectedOffer(state) {
  const { settings, panels } = state;

  return settings.priceHandles.find(
    offer => offer.frequency === panels.amountPanel.frequency
  );
}

export function getPaymentPostData(state) {
  const cart = getCart(state);
  const trackingData = getTrackingData(state);
  const recaptcha = getRecaptcha(state);
  const settings = getSettings(state);
  const formData = getParsedFormData(state);

  const postData = {
    store: cart.store,
    uid: cart.uid,
    jwt: cart.jwt,

    saleline: cart.items[0],
    customer: cart.customer,
    payment: cart.payment,

    ...trackingData,

    recaptchaResponse: recaptcha,
  };

  if (settings.showFundraising) {
    postData.fundraising = {
      pageUid: settings.fundraisingPageUid,
      ...formData.fundraising,
    };
  }

  return postData;
}

export function getPaymentData(formData) {
  return {
    cardNumber:  formData['payment.cardNumber'],
    expiryMonth: formData['payment.expiryMonth'],
    expiryYear:  formData['payment.expiryYear'],
    ccv:         formData['payment.ccv'],
  };
}

export function getCustomerFullName(formData) {
  const firstName = formData['customer.firstName'];
  const lastName  = formData['customer.lastName'];
  return `${firstName} ${lastName}`;
}
