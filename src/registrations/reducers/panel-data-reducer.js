import { types } from 'registrations/actions';

const initialState = {
  eventId: null,
  qtys: {},
  participants: [],
};

export const panelDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.panelDataSetEvent:
      return {
        ...state,
        eventId: action.eventId,
      };

    case types.panelDataResetEvent:
      return {
        ...state,
        eventId: initialState.eventId,
      };

    case types.panelDataSetQtys:
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

    case types.panelDataResetQtys:
      return {
        ...state,
        qtys: initialState.qtys,
      };

    case types.panelDataSetFirstNames:
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

    case types.panelDataResetFirstNames:
      return {
        ...state,
        participants: [],
      };

    case types.panelDataSetDetails:
      return {
        ...state,
        participants: state.participants.map((participant, index) => {
          if (index === action.index) {
            return {
              ...participant,
              customer: action.customerForm,
              extendForm: action.extendForm,
              errors: [],
            };
          } else {
            return participant;
          }
        }),
      };

    case types.panelDataSetErrors:
      return {
        ...state,
        participants: state.participants.map((participant, index) => {
          if (index === action.index) {
            return {
              ...participant,
              errors: action.errors,
            };
          } else {
            return participant;
          }
        }),
      };

    case types.panelDataResetDetails:
      return {
        ...state,
        participants: state.participants.map((participant, index) => {
          if (index === action.index) {
            // Just keep the first name.
            return { 
              ...participant,
              details: {
                firstName: participant.customer.firstName,
              },
            };
          } else {
            return participant;
          }
        }),
      };

    default:
      return state;
  }
};
