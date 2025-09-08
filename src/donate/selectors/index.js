import { statuses } from 'shared/actions';
import { getCart, getTrackingData, getRecaptcha, getTurnstileToken, getSetting, getFormData, getParsedFormData, getCurrency } from 'shared/selectors';
import { formatPrice, calculateImpression, isMethodAllowedForFrequency } from 'shared/utils';

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

  const currency = getCurrency(state);
  const hideCurrencyCode = getSetting(state, 'hideCurrencyCode');

  return formatPrice(selection.amount, currency, hideCurrencyCode);
};

export const getSelectedPriceHandle = (state) => {
  const offer = getSelectedOffer(state);
  const selection = getDonationPanelSelection(state);
  
  // make sure something is selected.
  if (!selection || !selection.amount) {
    return null;
  }

  // try to find a matching price handle.
  for (const priceHandle of offer.amounts) {
    if (Math.abs(Number(priceHandle.amount) - Number(selection.amount)) < Number.EPSILON) {
      return priceHandle;
    }
  }

  // return the variable amount handle (if there is one).
  const priceHandle = offer.amounts.find(priceHandle => priceHandle.variable);
  return priceHandle;
};

export const getFrequencyLabel = (state, offerUid) => {
  const priceHandles = getPriceHandles(state);
  const offer = priceHandles.find(offer => offer.offerUid === offerUid);
  return offer ? offer.label : '';
};

export const getSchedules = (state) => {
  const offer = getSelectedOffer(state);
  return offer ? offer.schedules : undefined;
};

export const getScheduleLabel = (state) => {
  // get the schedule name from rg upsell if present.
  const rgUpsell = getRgUpsell(state);
  if (rgUpsell) return rgUpsell.scheduleName;

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
  return paymentMethods.filter(paymentMethod => isMethodAllowedForFrequency(paymentMethod, frequency));
};

export const getCreateSalePostData = (state) => {
  const cart = getCart(state);
  const formData = getParsedFormData(state);
  const fundraisingData = getFundraisingData(state);
  const trackingData = getTrackingData(state);
  const recaptcha = getRecaptcha(state);
  const turnstileToken = getTurnstileToken(state);
  const impression = calculateImpression(recaptcha);

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

    impression: impression,
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

export const getHasExpressPaymentMethods = (state) => {
  const expressMethods = ['wallet', 'paypal'];

  const paymentMethods = getPaymentMethods(state);
  for (const method of paymentMethods) {
    if (expressMethods.includes(method.type)) return true;
  }

  return false;
};

export const getRgUpsell = (state) => {
  return state.rgUpsell;
};

export const getDonationAmount = (state) => {
  // use the rg upsell amount if present.
  const rgUpsell = getRgUpsell(state);
  if (rgUpsell) return rgUpsell.amount;

  // otherwise use the amount selected on the donation panel.
  const selection = getDonationPanelSelection(state);
  return selection ? selection.amount : 0;
};

export const getDonationFrequency = (state) => {
  // if an rg upsell is present, the frequency is recurring.
  const rgUpsell = getRgUpsell(state);
  if (rgUpsell) return 'recurring';

  // otherwise use the frequency selected on the donation panel.
  return getSelectedFrequency(state);
};

export const getIsRgUpsellEnabled = (state) => {
  // if an offer has an rg upsell, and we have settings for the RgUpsellPanel, then rg upsell is enabled.

  let offerHasRgUpsell = false;
  const offers = getPriceHandles(state);
  for (const offer of offers) {
    if (offer.rgUpsell) {
      offerHasRgUpsell = true;
      break;
    }
  }

  const panelSettings = getSetting(state, 'panels');
  const hasRgUpsellPanelSettings = !!panelSettings['RgUpsellPanel'];

  return offerHasRgUpsell && hasRgUpsellPanelSettings;
};
