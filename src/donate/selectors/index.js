import { statuses } from 'shared/actions';
import { getCart, getTrackingData, getRecaptcha, getSettings, getParsedFormData } from 'shared/selectors';
import { formatPrice } from 'form/utils';

export function getIsBusy(state) {
  return state.status !== statuses.ready;
}

export function getCartItem(state) {
  return state.cart.items[0];
}

export function getCustomer(state) {
  return getCart(state).customer;
}

export function getSelectedFrequency(state) {
  return state.panels.donationPanel.frequency;
}

export function getSelectedAmount(state) {
  const { donationPanel } = state.panels;
  const { currency } = state.settings;

  const selection = donationPanel.selections[donationPanel.frequency];

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

export function getDonationPanelSelection(state) {
  const { donationPanel } = state.panels;
  return donationPanel.selections[donationPanel.frequency];
}

export function getSelectedOffer(state) {
  const { settings, panels } = state;

  return settings.priceHandles.find(
    offer => offer.frequency === panels.donationPanel.frequency
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

export function getSuccessfulDonation(state) {
  const cart = getCart(state);
  const item = cart.items[0];

  const frequency = item ? getFrequencyLabel(state, item.offerUid) : '';
  const amount = item ? formatPrice(item.price) : '0';

  return { frequency, amount };
}
