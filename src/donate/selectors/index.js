import { statuses } from 'shared/actions';
import { getCart, getTrackingData, getRecaptcha, getTurnstileToken, getSetting, getFormData, getParsedFormData } from 'shared/selectors';
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
    value: fund.offerId,
    label: fund.title,
  }));
};

export const getDefaultFundId = (state) => {
  const funds = getFunds(state);
  if (!funds || !funds.length) return undefined;

  return funds[0].offerId;
};

export const getFund = (state, fundId) => {
  return getFunds(state).find(fund => fund.offerId === fundId);
};

export const getSelectedFund = (state) => {
  const { fundId } = getFormData(state);
  if (!fundId) return null;

  return getFund(state, fundId);
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
  return offer ? offer.schedules : undefined;
}

export const getScheduleLabel = (state) => {
  const selection = getDonationPanelSelection(state);
  if (!selection) return '';

  // If we don't have an offer payment UID, this isn't a recurring payment.
  if (!selection.offerPaymentUid) return '';

  const schedules = getSchedules(state);

  const schedule = schedules
    ? schedules.find(schedule => schedule.offerPaymentUid === selection.offerPaymentUid)
    : null;

  // If we couldn't find a schedule, just assume monthly.
  return schedule ? schedule.label : 'Monthly';
};

export const getSelectedOffer = (state) => {
  const donationPanel = getDonationPanel(state);
  const priceHandles = getPriceHandles(state);
  return priceHandles.find(offer => offer.frequency === donationPanel.frequency);
};

export const getDonationStartDate = (state) => {
  const formData = getFormData(state);
  const frequency = getSelectedFrequency(state);
  const paymentMethod = getSelectedPaymentMethod(state);

  if (frequency === 'recurring' && !!paymentMethod.startDates) {
    return formData['saleline.startDate'] || paymentMethod.startDates[0];
  }

  return undefined;
};

export const getDonationGivingType = (state) => {
  const formData = getFormData(state);
  const selectedGivingType = formData['saleline.givingType'] || '';

  // Use input text for 'other' giving type.
  if (selectedGivingType.toLowerCase() === 'other') {
    return formData['saleline.otherGivingType'] || selectedGivingType;
  }

  return selectedGivingType;
};

export const getSelectedPaymentMethod = (state) => {
  const formData = getFormData(state);
  const paymentType = formData['payment.type'];
  return getPaymentMethod(state, paymentType);
};

export const getPaymentMethod = (state, type, gateway = null) => {
  const paymentMethods = getSetting(state, 'paymentMethods') || [];
  return paymentMethods.find(pm => pm.type === type && (!gateway || pm.gateway === gateway));
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

export const getCreateSalePostData = (state) => {
  const cart = getCart(state);
  const formData = getParsedFormData(state);
  const fundraisingData = getFundraisingData(state);
  const trackingData = getTrackingData(state);
  const recaptcha = getRecaptcha(state);
  const turnstileToken = getTurnstileToken(state);

  return {
    storeUid:  cart.store,
    uid:       cart.uid,
    jwt:       cart.jwt,
    saleline:  cart.items[0],
    startDate: cart.items[0].startDate,
    customer:  cart.customer,

    fundraising: fundraisingData,
    recaptchaResponse: recaptcha,
    turnstileToken: turnstileToken,

    ...formData.additionalData,
    ...trackingData,
  };
};

export const getPaymentPostData = (state) => {
  const cart = getCart(state);

  return {
    ...getCreateSalePostData(state),
    payment: cart.payment,
  };
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

export const getHasExpressPaymentMethods = (state) => {
  const expressMethods = ['wallet', 'paypal'];

  const paymentMethods = getPaymentMethods(state);
  for (const method of paymentMethods) {
    if (expressMethods.includes(method.type)) return true;
  }

  return false;
};
