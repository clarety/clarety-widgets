import { Config } from 'clarety-utils';

export const getEvent = state => state.settings.event;

export const getEventName = state => {
  const event = getEvent(state);
  return event ? event.name : null;
};

export const getProgress = state => {
  const lastIndex = state.panelStack.length - 1;
  const lastPanel = state.panelStack[lastIndex];
  return lastPanel ? lastPanel.progress : 0;
};

export const getRegistrationTypes = state => {
  const event = getEvent(state);
  return event.registrationTypes;
};

export const getExtendFields = state => {
  try {
    return state.settings.extendForms[0].extendFields;
  } catch (error) {
    return null;
  }
};

const getExtendFormId = state => {
  try {
    return state.settings.extendForms[0].formId;
  } catch (error) {
    return null;
  }
};

export const getCreateTeamPostData = state => {
  const { panelData, formData } = state;

  return {
    seriesId: Config.get('seriesId'),
    eventId: panelData.eventId,
    teamId: '', // NOTE: the api wants an empty string...
    customerId: '124', // TODO: get customer ID when logged in...
    name: formData['team.name'],
    type: formData['team.type'],
    password: formData['team.password'],
    passwordRequired: !!formData['team.password'],
  };
};

export const getCreateRegistrationPostData = state => {
  const { panelData } = state;
  const { eventId, participants } = panelData;

  const postData = {
    eventId,
    registrations: participants.map(participant => ({
      quantity: 1,
      offerId: getOfferId(state, participant),
      participants: [{
        productId: getProductId(state, participant),
        customer: participant.customer,
        extendFormId: getExtendFormId(state),
        extendForm: participant.extendForm,
        ...participant.additionalData,
      }],
    })),
    fundraising: {
      donationAmount: getDonationAmount(state),
    }
  };

  return postData;
};

export const getSubmitRegistrationPostData = state => {
  return {
    uid: state.cart.uid,
    jwt: state.cart.jwt,
  };
};

const getOfferId = (state, participant) => {
  const types = getRegistrationTypes(state);
  return types[participant.type]
           .offers[0]
           .offerId;
};

const getProductId = (state, participant) => {
  const types = getRegistrationTypes(state);
  return types[participant.type]
           .offers[0]
           .registrationProducts[0]
           .products[0]
           .productId;
};

const getDonationAmount = state => {
  const { frequency, selections } = state.panels.amountPanel;
  return selections[frequency].amount;
};
