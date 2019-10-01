import { types } from 'registrations/actions';

const initialState = {
  eventId: null,
  qtys: {},
  participants: [],
};

export const panelDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.panelDataSetEvent:          return setEvent(state, action);
    case types.panelDataResetEvent:        return resetEvent(state, action);
    case types.panelDataSetQtys:           return setQtys(state, action);
    case types.panelDataResetQtys:         return resetQtys(state, action);
    case types.panelDataSetFirstNames:     return setFirstNames(state, action);
    case types.panelDataResetFirstNames:   return resetFirstNames(state, action);
    case types.panelDataSetDetails:        return setDetails(state, action);
    case types.panelDataSetAdditionalData: return setAdditionalData(state, action);
    case types.panelDataSetErrors:         return setErrors(state, action);
    case types.panelDataResetDetails:      return resetDetails(state, action);
    default:                               return state;
  }
};

function setEvent(state, action) {
  return {
    ...state,
    eventId: action.eventId,
  };
}

function resetEvent(state, action) {
  return {
    ...state,
    eventId: null,
  };
}

function setQtys(state, action) {
  const participants = [];
  for (const [key, value] of Object.entries(action.qtys)) {
    for (let index = 0; index < value; index++) {
      participants.push({ type: key });
    }
  }

  return {
    ...state,
    qtys: action.qtys,
    participants,
  };
}

function resetQtys(state, action) {
  return {
    ...state,
    qtys: initialState.qtys,
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
      })
    ),
  };
}

function resetFirstNames(state, action) {
  return {
    ...state,
    participants: [],
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
