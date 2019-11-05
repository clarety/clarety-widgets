import { getOrganisation } from 'shared/selectors';
import { parseNestedElements } from 'shared/utils';

export const getSettings = (state) => state.settings;

export const getSetting = (state, setting) => getSettings(state)[setting];

export const getAuth = (state) => state.auth;

export const getCart = (state) => state.cart;

export const getPanels = (state) => state.panels;

export const getFormData = (state) => state.formData;

export const getParticipants = (state) => state.participants;

export const getTeams = (state) => state.teams;

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

export const getQtys = (state) => {
  const participants = getParticipants(state);

  const qtys = {};
  for (const participant of participants) {
    qtys[participant.type] = (qtys[participant.type] || 0) + 1;
  }

  return qtys;
};

export const getCartTotal = (state) => {
  const { items } = getCart(state);
  const total = items.reduce((total, item) => total += item.price * item.quantity, 0);

  const currency = getSetting(state, 'currency');
  return `${currency.code} ${currency.symbol}${total.toFixed(2)}`;
};

export const getCustomer = (state) => getCart(state).customer;

export const getPreviousParticipants = (state) => {
  const customer = getCustomer(state);
  return customer ? customer.previous : [];
};

export const getParticipant = (state, index) => getParticipants(state)[index];

export const getParticipantOffer = (state, index) => {
  const participant = getParticipant(state, index);
  return getOffer(state, participant);
};

export const getWaves = (state, index) => {
  const participant = getParticipant(state, index);
  const offer = getOffer(state, participant);
  return offer.waves;
};

export const getWaveOptions = (state, index) => getWaves(state, index).map(
  product => ({
    label: product.name,
    value: product.productId,
}));

export const getAddOns = (state) => getEvent(state).addOns;

export const getIsPrefilled = (state, index) => {
  // If participant has a customer ID then they've been pre-filled.
  const participant = getParticipant(state, index);
  return participant.customer && participant.customer.id;
};

export const getIsCorporateTeam = (state, index) => {
  const cart = getCart(state);
  if (!cart.organisation) return false;

  return !!cart.organisation.isCorporateTeam;
};

export const getOffersForAllParticipants = (state) => getParticipants(state).map(
  participant => getOffers(state, participant.type)
);

export const getOffers = (state, type) => getRegistrationTypes(state)[type].offers;

export const getExtendFields = (state) => {
  try {
    return state.settings.extendForm.extendFields;
  } catch (error) {
    return null;
  }
};

const getExtendFormId = (state) => {
  try {
    return state.settings.extendForm.formId;
  } catch (error) {
    return null;
  }
};

export const getSaleId = (state) => getCart(state).id;

export const getChannel = (state) => {
  const mode = getSetting(state, 'registrationMode');
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
    seriesId: getSetting(state, 'seriesId'),
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
  const organisation = getOrganisation(state);

  return {
    eventId: event.eventId,
    organisationId: organisation ? organisation.teamId : '',
    channel: channel,
    registrations: participants.map(
      participant => getParticipantPostData(state, participant)
    ),
    fundraising: fundraising,
  };
};

const getParticipantPostData = (state, participant) => {
  const offerId = participant.offerId || getDefaultOffer(state, participant).offerId;
  const productId = participant.waveProductId || getDefaultWave(state, participant).productId;
  const customer = parseNestedElements(participant.customer);
  const extendFormId = getExtendFormId(state);
  const addOns = getParticipantAddOns(participant);

  return {
    offerId: offerId,
    quantity: 1,
    participants: [{
      productId: productId,
      customer: customer,
      extendFormId: extendFormId,
      extendForm: participant.extendForm,
      addons: addOns,
      ...participant.additionalData,
    }],
  };
};

const getParticipantAddOns = (participant) => participant.addOns.map(offerId => ({ offerId }));

const getOffer = (state, participant) => {
  const offers = getOffers(state, participant.type);

  if (!participant.offerId) return offers[0];

  return offers.find(offer => offer.offerId === participant.offerId);
}

const getDefaultOffer = (state, participant) => getOffers(state, participant.type)[0];

const getDefaultWave = (state, participant) => getDefaultOffer(state, participant).waves[0];

const getFundraisingPostData = (state) => {
  return {
    donationAmount: getDonationAmount(state),
  };
};

const getDonationAmount = (state) => {
  const cart = getCart(state);
  const item = cart.items.find(item => item.type === 'donation');
  
  return item ? item.price : 0;
};

export const getSubmitRegistrationPostData = (state) => {
  return {
    uid: state.cart.uid,
    jwt: state.cart.jwt,
  };
};
