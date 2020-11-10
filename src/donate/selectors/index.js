import { statuses } from 'shared/actions';
import { getCart, getTrackingData, getRecaptcha, getSetting, getFormData, getParsedFormData } from 'shared/selectors';
import { formatPrice } from 'form/utils';

export const getIsBusy = (state) => state.status !== statuses.ready;

export const getCartItem = (state) => state.cart.items[0];

export const getCustomer = (state) => getCart(state).customer;

export const getDonationPanel = (state) => state.panels.donationPanel;

export const getPriceHandles = (state) => getSetting(state, 'priceHandles');

export const getGivingTypeOptions = (state) => getSetting(state, 'givingTypeOptions');

export const getCustomerHasProfile = (state) => getSetting(state, 'customerHasProfile');

export const getSelectedFrequency = (state) => getDonationPanel(state).frequency;

export const getStoreUid = (state) => getCart(state).store;

export const getFunds = (state) => getSetting(state, 'funds');

export const getFundOptions = (state) => {
  return getFunds(state).map(fund => ({
    value: fund.fundUid,
    label: fund.title,
  }));
};

export const getDefaultFundUid = (state) => {
  const fund = getFunds(state).find(fund => fund.isDefault);
  return fund ? fund.fundUid : undefined;
};

export const getFund = (state, fundUid) => {
  return getFunds(state).find(fund => fund.fundUid === fundUid);
};

export const getSelectedFund = (state) => {
  const { fundUid } = getFormData(state);
  if (!fundUid) return null;

  return getFund(state, fundUid);
};

export const getDonationPanelSelection = (state) => {
  const donationPanel = getDonationPanel(state);
  return donationPanel.selections[donationPanel.frequency];
};

export const getSelectedAmount = (state) => {
  const selection = getDonationPanelSelection(state);
  
  if (!selection || !selection.amount) return '';

  const currency = getSetting(state, 'currency');
  const amount = Number(selection.amount).toFixed(2);
  
  return currency.symbol + amount;
};

export const getFrequencyLabel = (state, offerUid) => {
  const priceHandles = getPriceHandles(state);
  const offer = priceHandles.find(offer => offer.offerUid === offerUid);
  return offer ? offer.label : '';
};

export const getSchedules = (state) => {
  const offer = getSelectedOffer(state);
  return offer.schedules;
}

export const getScheduleLabel = (state) => {
  const selection = getDonationPanelSelection(state);
  const schedules = getSchedules(state);
  const offerPaymentUid = selection.offerPaymentUid;
  if(schedules && offerPaymentUid){
    const result = schedules.find(schedule => schedule.offerPaymentUid === offerPaymentUid);
    return result?result.label:'';
  }
  return '';
};

export const getSelectedOffer = (state) => {
  const donationPanel = getDonationPanel(state);
  const priceHandles = getPriceHandles(state);
  return priceHandles.find(offer => offer.frequency === donationPanel.frequency);
};

export const getSalelineDescription = (state) => {
  return getFormData(state)['saleline.givingType'];
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
  const formData = getParsedFormData(state);
  const fundraisingData = getFundraisingData(state);
  const trackingData = getTrackingData(state);
  const recaptcha = getRecaptcha(state);

  const postData = {
    storeUid:  cart.store,
    uid:       cart.uid,
    jwt:       cart.jwt,
    saleline:  cart.items[0],
    customer:  cart.customer,
    payment:   cart.payment,

    fundraising: fundraisingData,
    recaptchaResponse: recaptcha,

    ...formData.additionalData,
    ...trackingData,
  };

  return postData;
};

const getFundraisingData = (state) => {
  const pageUid = getSetting(state, 'fundraisingPageUid');
  if (!pageUid) return undefined;

  const formData = getParsedFormData(state);

  return { pageUid, ...formData.fundraising };
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
