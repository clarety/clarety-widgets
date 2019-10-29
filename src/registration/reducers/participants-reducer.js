import { types } from 'registration/actions';

const initialState = [];

export const participantsReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.setParticipantQtys:           return setQtys(state, action);
    case types.resetParticipantQtys:         return resetQtys(state, action);

    case types.setParticipantFirstNames:     return setFirstNames(state, action);
    case types.resetParticipantFirstNames:   return resetFirstNames(state, action);

    case types.setParticipantOffers:         return setOffers(state, action);
    case types.resetParticipantOffers:       return resetOffers(state, action);

    case types.setParticipantDetails:        return setDetails(state, action);
    case types.resetParticipantDetails:      return resetDetails(state, action);

    case types.selectParticipantAddOn:       return selectAddOn(state, action);
    case types.deselectParticipantAddOn:     return deselectAddOn(state, action);

    case types.setParticipantAdditionalData: return setAdditionalData(state, action);
    case types.setParticipantErrors:         return setErrors(state, action);
    
    default:                                 return state;
  }
};

function setQtys(state, action) {
  const participants = [];
  for (const [type, count] of Object.entries(action.qtys)) {
    for (let index = 0; index < count; index++) {
      participants.push({ type: type });
    }
  }

  return participants;
}

function resetQtys(state, action) {
  return [];
}

function setFirstNames(state, action) {
  return state.map((participant, index) => ({
    ...participant,
    customer: {
      ...participant.customer,
      firstName: action.firstNames[index],
    },
    addOns: [],
  }));
}

function resetFirstNames(state, action) {
  return state.map((participant) => ({
    ...participant,
    customer: {
      firstName: undefined,
    },
  }));
}

function setOffers(state, action) {
  return state.map((participant, index) => ({
    ...participant,
    offer: action.offers[index],
  }));
}

function resetOffers(state, action) {
  return state.map((participant) => ({
    ...participant,
    offer: undefined,
  }));
}

function setDetails(state, action) {
  return state.map((participant, index) => {
    if (index !== action.index) return participant;

    return {
      ...participant,
      customer: action.customerForm,
      extendForm: action.extendForm,
      errors: [],
    };
  });
}

function resetDetails(state, action) {
  return state.map((participant, index) => {
    if (index !== action.index) return participant;

    return {
      ...participant,
      customer: {
        firstName: participant.customer.firstName,
      },
      extendForm: {},
      errors: [],
    };
  });
}

function setAdditionalData(state, action) {
  return state.map((participant, index) => {
    if (index !== action.index) return participant;

    return {
      ...participant,
      additionalData: action.additionalData,
    };
  });
}

function selectAddOn(state, action) {
  return state.map((participant, index) => {
    if (index !== action.index) return participant;

    return {
      ...participant,
      addOns: [
        ...participant.addOns,
        action.addOn,
      ],
    }; 
  });
}

function deselectAddOn(state, action) {
  return state.map((participant, index) => {
    if (index !== action.index) return participant;

    return {
      ...participant,
      addOns: participant.addOns.filter(
        addOn => addOn.offerId !== action.addOn.offerId
      ),
    };
  });
}

function setErrors(state, action) {
  return state.map((participant, index) => {
    if (index !== action.index) return participant;

    return {
      ...participant,
      errors: action.errors,
    };
  });
}
