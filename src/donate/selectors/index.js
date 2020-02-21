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

export const getPaymentMethod = (state, type) => {
  const paymentMethods = getSetting(state, 'paymentMethods') || [];
  return paymentMethods.find(paymentMethod => paymentMethod.type === type);
};

export const getPaymentMethods = (state) => {
  const paymentMethods = getSetting(state, 'paymentMethods') || [];

  // Filter available methods for selected frequency.
  const frequency = getSelectedFrequency(state);
  return paymentMethods.filter(paymentMethod => {
    if (paymentMethod.singleOnly && frequency !== 'single') return false;
    if (paymentMethod.recurringOnly && frequency !== 'recurring') return false;
    return true;
  });
};

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
    postData.startDate = postData.payment.startDate;
    postData.payment.startDate = undefined;
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
