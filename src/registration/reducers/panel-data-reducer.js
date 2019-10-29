import { types } from 'registration/actions';

const initialState = {
  participants: [],
};

export const panelDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.panelDataSetQtys:           return setQtys(state, action);
    case types.panelDataResetQtys:         return resetQtys(state, action);

    case types.panelDataSetFirstNames:     return setFirstNames(state, action);
    case types.panelDataResetFirstNames:   return resetFirstNames(state, action);

    case types.panelDataSetOffers:         return setOffers(state, action);
    case types.panelDataResetOffers:       return resetOffers(state, action);

    case types.panelDataSetDetails:        return setDetails(state, action);
    case types.panelDataResetDetails:      return resetDetails(state, action);

    case types.panelDataSelectAddOn:       return selectAddOn(state, action);
    case types.panelDataDeselectAddOn:     return deselectAddOn(state, action);

    case types.panelDataSetAdditionalData: return setAdditionalData(state, action);
    case types.panelDataSetErrors:         return setErrors(state, action);
    
    default:                               return state;
  }
};

function setQtys(state, action) {
  const participants = [];
  for (const [type, count] of Object.entries(action.qtys)) {
    for (let index = 0; index < count; index++) {
      participants.push({ type: type });
    }
  }

  return {
    ...state,
    participants,
  };
}

function resetQtys(state, action) {
  return {
    ...state
  };
}

function setFirstNames(state, action) {
  return {
    ...state,
    participants: state.participants.map((participant, index) =>
      ({
        ...participant,
        customer: {
          ...participant.customer,
          firstName: action.firstNames[index],
        },
        addOns: [],
      })
    ),
  };
}

function resetFirstNames(state, action) {
  return {
    ...state,
    participants: state.participants.map((participant) => ({
      ...participant,
      customer: {
        firstName: undefined,
      },
    })),
  };
}

function setOffers(state, action) {
  return {
    ...state,
    participants: state.participants.map((participant, index) =>
      ({
        ...participant,
        offer: action.offers[index],
      })
    ),
  };
}

function resetOffers(state, action) {
  return {
    ...state,
    participants: state.participants.map((participant) => ({
      ...participant,
      offer: undefined,
    })),
  };
}

function setDetails(state, action) {
  return {
    ...state,
    participants: state.participants.map((participant, index) => {
      if (index !== action.index) return participant;

      return {
        ...participant,
        customer: action.customerForm,
        extendForm: action.extendForm,
        errors: [],
      };
    }),
  };
}

function resetDetails(state, action) {
  return {
    ...state,
    participants: state.participants.map((participant, index) => {
      if (index !== action.index) return participant;

      return {
        ...participant,
        customer: {
          firstName: participant.customer.firstName,
        },
        extendForm: {},
        errors: [],
      };
    }),
  };
}

function setAdditionalData(state, action) {
  return {
    ...state,
    participants: state.participants.map((participant, index) => {
      if (index !== action.index) return participant;

      return {
        ...participant,
        additionalData: action.additionalData,
      };
    }),
  };
}

function selectAddOn(state, action) {
  return {
    ...state,
    participants: state.participants.map((participant, index) => {
      if (index !== action.index) return participant;

      return {
        ...participant,
        addOns: [
          ...participant.addOns,
          action.addOn,
        ],
      }; 
    }),
  };
}

function deselectAddOn(state, action) {
  return {
    ...state,
    participants: state.participants.map((participant, index) => {
      if (index !== action.index) return participant;

      return {
        ...participant,
        addOns: participant.addOns.filter(
          addOn => addOn.offerId !== action.addOn.offerId
        ),
      };
    }),
  };
}

function setErrors(state, action) {
  return {
    ...state,
    participants: state.participants.map((participant, index) => {
      if (index !== action.index) return participant;

      return {
        ...participant,
        errors: action.errors,
      };
    }),
  };
}
