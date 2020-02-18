import { statuses } from 'shared/actions';
import { getCart, getTrackingData, getRecaptcha, getSetting, getFormData, getParsedFormData } from 'shared/selectors';
import { formatPrice } from 'form/utils';

export const getIsBusy = (state) => state.status !== statuses.ready;

export const getCartItem = (state) => state.cart.items[0];

export const getCustomer = (state) => getCart(state).customer;

export const getDonationPanel = (state) => state.panels.donationPanel;

export const getPriceHandles = (state) => getSetting(state, 'priceHandles');

export const getSelectedFrequency = (state) => getDonationPanel(state).frequency;

export const getDonationPanelSelection = (state) => {
  const donationPanel = getDonationPanel(state);
  return donationPanel.selections[donationPanel.frequency];
};

export const getSelectedAmount = (state) => {
  const selection = getDonationPanelSelection(state);
  
  if (!selection && !selection.amount) return '';

  const currency = getSetting(state, 'currency');
  const amount = Number(selection.amount).toFixed(2);
  
  return currency.symbol + amount;
};

export const getFrequencyLabel = (state, offerUid) => {
  const priceHandles = getPriceHandles(state);
  const offer = priceHandles.find(offer => offer.offerUid === offerUid);
  return offer ? offer.label : '';
};

export const getSelectedOffer = (state) => {
  const donationPanel = getDonationPanel(state);
  const priceHandles = getPriceHandles(state);
  return priceHandles.find(offer => offer.frequency === donationPanel.frequency);
};

export const getPaymentMethods = (state, settings) => {
  // Default to credit card if there's no setting.
  if (!settings.paymentMethods) {
    return [{ type: 'gatewaycc' }];
  }

  const result = [];

  if (settings.paymentMethods.includes('credit-card')) {
    result.push({ type: 'gatewaycc' });
  }

  const frequency = getSelectedFrequency(state);
  if (frequency === 'recurring' && settings.paymentMethods.includes('direct-debit')) {
    result.push({ type: 'gatewaydd' });
  }

  return result;
};

export const getStartDates = (state) => getSetting(state, 'startDates');

export const getPaymentPostData = (state) => {
  const cart = getCart(state);
  const trackingData = getTrackingData(state);
  const recaptcha = getRecaptcha(state);
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

  // Direct debit start date.
  if (cart.payment.type === 'gatewaydd' && getSetting(state, 'startDates')) {
    postData.startDate = cart.payment.startDate;
    cart.payment.startDate = undefined;
  }

  // Optional fundraising data.
  const fundraisingPageUid = getSetting(state, 'fundraisingPageUid');
  if (fundraisingPageUid) {
    postData.fundraising = {
      pageUid: fundraisingPageUid,
      ...formData.fundraising,
    };
  }

  // Covert payment type to 'cc' or 'dd'.
  if (cart.payment.type === 'gatewaycc') cart.payment.type = 'cc';
  if (cart.payment.type === 'gatewaydd') cart.payment.type = 'dd';

  return postData;
};

export const getCustomerFullName = (state) => {
  const formData = getFormData(state);

  const firstName = formData['customer.firstName'];
  const lastName  = formData['customer.lastName'];
  return `${firstName} ${lastName}`;
};

export const getSuccessfulDonation = (state) => {
  const cart = getCart(state);
  const item = cart.items[0];

  const frequency = item ? getFrequencyLabel(state, item.offerUid) : '';
  const amount = item ? formatPrice(item.price) : '0';

  return { frequency, amount };
};
