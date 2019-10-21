import { Config } from 'clarety-utils';
import { parseNestedElements } from 'shared/utils';

export const getSettings = (state) => state.settings;

export const getSetting = (state, setting) => getSettings(state)[setting];

export const getAuth = (state) => state.auth;

export const getCart = (state) => state.cart;

export const getPanels = (state) => state.panels;

export const getPanelData = (state) => state.panelData;

export const getFormData = (state) => state.formData;

export const getEvent = (state) => getSettings(state).event;

export const getEventName = (state) => {
  const event = getEvent(state);
  return event ? event.name : null;
};

export const getPanelCount = (state) => state.panelManager.length;

export const getCurrentPanelIndex = (state) => state.panelManager.findIndex(panel => panel.status === 'edit');

export const getProgress = (state) => {
  const index = getCurrentPanelIndex(state);
  const count = getPanelCount(state);
  return index / (count - 1) * 100;
};

export const getRegistrationTypes = (state) => {
  const event = getEvent(state);
  return event ? event.registrationTypes: null;
};

export const getQtys = (state) => getPanelData(state).qtys;

export const getCartTotal = (state) => {
  const total = getDonationAmount(state) + getSelectedOffersTotal(state);
  const currency = getSetting(state, 'currency');
  return `${currency.code} ${currency.symbol}${total.toFixed(2)}`;
};

export const getCustomer = (state) => getCart(state).customer;

export const getPreviousParticipants = (state) => {
  const customer = getCustomer(state);
  return customer ? customer.previous : [];
};

export const getParticipants = (state) => getPanelData(state).participants;

export const getParticipant = (state, index) => getParticipants(state)[index];

export const getPartcipantOffer = (state, index) => {
  // Use selected offer if possible.
  const participant = getParticipant(state, index);
  if (participant.offer) return participant.offer;

  // Otherwise, use first offer for type.
  const offers = getOffers(state, participant.type);
  return offers[0];
};

export const getIsPrefilled = (state, index) => {
  // If participant has a customer ID then they've been prefilled.
  const participant = getParticipant(state, index);
  return participant.customer && participant.customer.id;
};

export const getOffersForAllParticipants = (state) => getParticipants(state).map(
  participant => getOffers(state, participant.type)
);

export const getOffers = (state, type) => getRegistrationTypes(state)[type].offers;

export const getSelectedOffersTotal = (state) => {
  const participants = getParticipants(state);

  return participants.reduce((total, participant) =>
    participant.offer
      ? Number(participant.offer.amount) + total
      : total
  , 0);
};

export const getExtendFields = (state) => {
  try {
    return state.settings.extendForms[0].extendFields;
  } catch (error) {
    return null;
  }
};

const getExtendFormId = (state) => {
  try {
    return state.settings.extendForms[0].formId;
  } catch (error) {
    return null;
  }
};

export const getSaleId = (state) => getCart(state).id;

export const getRegistrationMode = (state) => getCart(state).registrationMode;

export const getChannel = (state) => {
  const mode = getRegistrationMode(state);
  if (mode === 'individual') return '7';
  if (mode === 'group')      return '8';
  if (mode === 'family')     return '9';

  return undefined;
};

export const getIsLoggedIn = (state) => !!getAuth(state).jwt;

export const getCreateTeamPostData = (state) => {
  const event = getEvent(state);
  const customer = getCustomer(state);
  const formData = getFormData(state);

  return {
    seriesId: Config.get('seriesId'),
    eventId: event.eventId,
    teamId: '', // NOTE: the api wants an empty string...
    customerId: customer.id,
    name: formData['team.name'],
    type: formData['team.type'],
    password: formData['team.password'],
    passwordRequired: !!formData['team.password'],
  };
};

export const getCreateRegistrationPostData = (state) => {
  const event = getEvent(state);
  const channel = getChannel(state);
  const participants = getParticipants(state);
  const fundraising = getFundraisingPostData(state);

  return {
    eventId: event.eventId,
    channel: channel,
    registrations: participants.map(
      participant => getParticipantPostData(state, participant)
    ),
    fundraising: fundraising,
  };
};

const getParticipantPostData = (state, participant) => {
  const extendFormId = getExtendFormId(state);
  const offerId = getOfferId(state, participant);
  const productId = getProductId(state, participant);
  const customer = parseNestedElements(participant.customer);

  return {
    quantity: 1,
    offerId: offerId,
    participants: [{
      productId: productId,
      customer: customer,
      extendFormId: extendFormId,
      extendForm: participant.extendForm,
      ...participant.additionalData,
    }],
  };
};

const getOfferForParticipant = (state, participant) => {
  // If participant has a selected offer, use it.
  // Otherwise, use the first offer for the registration type.
  return participant.offer || getOffers(state, participant.type)[0];
};

const getOfferId = (state, participant) => {
  const offer = getOfferForParticipant(state, participant);
  return offer.offerId;
};

const getProductId = (state, participant) => {
  const offer = getOfferForParticipant(state, participant);
  return offer.registrationProducts[0].products[0].productId;
};

const getFundraisingPostData = (state) => {
  const donationAmount = getDonationAmount(state);

  return {
    donationAmount: donationAmount,
  };
};

const getAmountPanel = (state) => getPanels(state).amountPanel;

const getDonationAmount = (state) => {
  const { frequency, selections } = getAmountPanel(state);
  const selection = selections[frequency];

  return selection ? Number(selection.amount) : 0;
};

export const getSubmitRegistrationPostData = (state) => {
  return {
    uid: state.cart.uid,
    jwt: state.cart.jwt,
  };
};
