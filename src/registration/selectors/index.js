import { getOrganisation, getPromoCode, getTrackingData, getCurrency } from 'shared/selectors';
import { parseNestedElements } from 'shared/utils';

export const getSettings = (state) => state.settings;

export const getSetting = (state, setting) => getSettings(state)[setting];

export const getAuth = (state) => state.auth;

export const getCart = (state) => state.cart;

export const getPanels = (state) => state.panels;

export const getFormData = (state) => state.formData;

export const getParticipants = (state) => state.participants;
export const getParticipantCount = (state) => getParticipants(state).length;

export const getTeams = (state) => state.teams;

export const getEvents = (state) => getSettings(state).events;

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
  return event ? event.registrationTypes : null;
};

export const getEventMerchandise = (state) => {
  const event = getEvent(state);
  return event ? event.merchandise : [];
};

export const getMerchOffer = (state, offerId) => {
  const merch = getEventMerchandise(state);
  return merch.find(offer => offer.offerId === offerId);
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
  const cart = getCart(state);
  let total = cart.items.reduce((total, item) => {
    return total += (item.price * item.quantity) - (item.discount || 0);
  }, 0);
  return total;
};

export const getFormattedCartTotal = (state) => {
  const total = getCartTotal(state);
  const currency = getCurrency(state);

  if (!currency.code || currency.code === 'NOK') {
    return `${currency.symbol}${total.toFixed(2)}`;
  }

  return `${currency.code} ${currency.symbol}${total.toFixed(2)}`;
};

export const getCustomer = (state) => getCart(state).customer;

export const getPreviousParticipants = (state) => {
  const customer = getCustomer(state);
  return (customer && customer.previous) ? customer.previous : [];
};

export const getParticipant = (state, index) => getParticipants(state)[index];

export const getParticipantOffer = (state, index) => {
  const participant = getParticipant(state, index);
  return getOffer(state, participant);
};

export const getStateOptions = (state) => {
  const events = getEvents(state);
  if (!events) return [];

  const states = {};

  for (const event of events) {
    if (event.state) states[event.state] = true;
  }

  return Object.keys(states).sort().map(state => ({
    value: state,
    label: state,
  }));
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

export const getIsLoggedIn = (state) => !!getAuth(state).jwt;

export const getPaymentMethods = (state) => {
  const hasCart = !!getCart(state).uid;
  const isFree = getCartTotal(state) === 0 || getIsCorporateTeam(state);

  if (hasCart && isFree) return [{ type: 'na' }];

  return getSetting(state, 'paymentMethods') || [{ type: 'gatewaycc' }];
};

export const getPaymentMethod = (state, type) => {
  return getPaymentMethods(state).find(method => method.type === type);
};

export const getCreateTeamPostData = (state) => {
  const event = getEvent(state);
  const customer = getCustomer(state);
  const formData = getFormData(state);

  return {
    seriesId:         getSetting(state, 'seriesId'),
    eventId:          event.eventId,
    teamId:           '', // NOTE: the api wants an empty string...
    customerId:       customer.id,
    name:             formData['team.name'],
    type:             formData['team.type'] || getSetting(state, 'teamType'),
    passwordRequired: formData['team.passwordRequired'] || false,
    password:         formData['team.passwordRequired'] ? formData['team.password'] : undefined,
  };
};

export const getCreateRegistrationPostData = (state) => {
  const cart = getCart(state);
  const event = getEvent(state);
  const promoCode = getPromoCode(state);
  const participants = getParticipants(state);
  const fundraising = getFundraisingPostData(state);
  const organisation = getOrganisation(state);
  const merchandise = getMerchandisePostData(state);
  const trackingData = getTrackingData(state);

  return {
    eventId: event.eventId,
    organisationId: organisation ? organisation.teamId : '',
    promoCode: promoCode,
    registrations: participants.map((participant, index) =>
      getParticipantPostData(state, participant, index)
    ),
    customer: cart.customer,
    fundraising: fundraising,
    merchandise: merchandise,
    ...trackingData,
  };
};

const getParticipantPostData = (state, participant, index) => {
  const offerId = participant.offerId || getDefaultOffer(state, participant).offerId;
  const appRef = getParticipantAppRef(state, index);
  const productId = participant.waveProductId || getDefaultWave(state, participant).productId;
  const customer = parseNestedElements(participant.customer);
  const extendFormId = getExtendFormId(state);
  const addOns = getParticipantAddOns(participant);

  return {
    offerId: offerId,
    appRef: appRef,
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

const getParticipantAppRef = (state, index) => {
  const cart = getCart(state);

  for (const item of cart.items) {
    if (item.type !== 'event') continue;

    if (item.options.participantIndex === index) {
      return item.appRef;
    }
  }

  return null;
};

const getParticipantAddOns = (participant) => participant.addOns.map(offerId => ({ offerId }));

const getOffer = (state, participant) => {
  const offers = getOffers(state, participant.type);

  if (!participant.offerId) return offers[0];

  return offers.find(offer => offer.offerId === participant.offerId);
}

const getDefaultOffer = (state, participant) => getOffers(state, participant.type)[0];

const getDefaultWave = (state, participant) => getOffer(state, participant).waves[0];

const getFundraisingPostData = (state) => {
  const cart = getCart(state);
  const isRegisteringForSelf = getIsRegisteringForSelf(state);
  const donationAmount = getDonationAmount(state);

  if (isRegisteringForSelf) {
    return {
      ...cart.fundraising,
      donationAmount,
    };
  } else {
    return {
      donationAmount,
    };
  }
};

const getDonationAmount = (state) => {
  const cart = getCart(state);
  const item = cart.items.find(item => item.type === 'donation');
  
  return item ? item.price : 0;
};

const getMerchandisePostData = (state) => {
  const cart = getCart(state);
  const merchItems = cart.items.filter(item => item.type === 'merchandise');

  return merchItems.map(item => ({
    appRef:    item.appRef,
    quantity:  item.quantity,
    offerId:   item.offerId,
    productId: item.productId,
  }));
};

export const getSubmitRegistrationPostData = (state) => {
  const cart = getCart(state);
  const fundraising = getFundraisingPostData(state);

  return {
    uid: state.cart.uid,
    jwt: state.cart.jwt,
    fundraising: fundraising,
    ...cart.payment,
  };
};

const getIsRegisteringForSelf = (state) => {
  const cart = getCart(state);

  if (!cart.customer || !cart.customer.id) {
    return false;
  }

  const participants = getParticipants(state);

  for (const participant of participants) {
    if (participant.customer && participant.customer.id === cart.customer.id) {
      return true;
    }
  }

  return false;
}
