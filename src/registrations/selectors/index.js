export const getEvent = state => {
  if (!state.init) return null;

  const { events } = state.init;
  const { eventId } = state.panelData;
  return events.find(event => event.eventId === eventId);
};

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
    // TODO: what if we have multiple extend forms?
    return state.init.extendForms[0].extendFields;
  } catch (error) {
    return null;
  }
};

const getExtendFormId = state => {
  try {
    // TODO: what if we have multiple extend forms?
    return state.init.extendForms[0].formId;
  } catch (error) {
    return null;
  }
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
      }],
    })),
  };

  return postData;
};

export const getSubmitRegistrationPostData = state => {
  // TODO: need to add $0 payment info.
  return {
    saleId: state.registration.sale.id,
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
