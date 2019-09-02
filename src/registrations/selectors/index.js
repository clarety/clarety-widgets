import { panels } from 'registrations/actions';

export const getEvent = state => state.settings.event;

export const getEventName = state => {
  const event = getEvent(state);
  return event ? event.name : null;
};

export const getProgress = state => {
  const lastIndex = state.panels.length - 1;
  const lastPanel = state.panels[lastIndex];
  return lastPanel ? lastPanel.data.progress : 0;
};

export const getRegistrationTypes = state => {
  const event = getEvent(state);
  return event.registrationTypes;
};

export const getParticipantCount = state => {
  const qtysPanel = state.panels.find(panel => panel.name === panels.qtysPanel);
  const { qtys } = qtysPanel.data;
  return Object.values(qtys).reduce((value, total) => value + total, 0);
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

export const getCreateRegistrationPostData = state => {
  const { panelData, formData } = state;
  const { participants } = panelData;

  const postData = {
    eventId: formData['eventId'],
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
