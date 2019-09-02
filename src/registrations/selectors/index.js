import { parseNestedElements } from 'shared/utils';
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
  const qtysPanel = getPanel(state, panels.qtysPanel);
  const { qtys } = qtysPanel.data;
  return Object.values(qtys).reduce((value, total) => value + total, 0);
};

export const getPanel = (state, panelName) => {
  return state.panels.find(panel => panel.name === panelName);
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
  const { formData } = state;

  const participantCount = getParticipantCount(state);
  const types = getRegistrationTypes(state);
  const extendFormId = getExtendFormId(state);
  const participantsData = extractPartcipantsData(state);

  const registrations = [];

  for (let index = 0; index < participantCount; index++) {
    const participant = participantsData[index];
    const offer = types[participant.type].offers[0];
    const product = offer.registrationProducts[0].products[0];

    registrations.push({
      quantity: 1,
      offerId: offer.offerId,
      participants: [{
        productId: product.productId,
        customer: participant.customer,
        extendFormId: extendFormId,
        extendForm: participant.extendForm,
        ...participant.additionalData,
      }],
    });
  }

  const postData = {
    eventId: formData['eventId'],
    registrations: registrations,
  };

  return postData;
};

export const extractPartcipantsData = state => {
  const { formData } = state;

  const participants = [];

  const regex = new RegExp(/^participants\[(\d+)\]\.(.*)$/);

  for (let key in formData) {
    const match = regex.exec(key);
    if (match) {
      const [, index, field] = match;
      participants[index] = participants[index] || {};
      participants[index][field] = formData[key];
    }
  }

  return participants.map(
    participant => parseNestedElements(participant)
  );
};

export const getSubmitRegistrationPostData = state => {
  return {
    uid: state.cart.uid,
    jwt: state.cart.jwt,
  };
};
