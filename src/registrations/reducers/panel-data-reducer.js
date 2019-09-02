import { types } from 'registrations/actions';

const initialState = {
  eventId: null,
  qtys: {},
  participants: [],
};

export const panelDataReducer = (state = initialState, action) => {
  switch (action.type) {
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

    case types.panelDataSetAdditionalData:
      return {
        ...state,
        participants: state.participants.map((participant, index) => {
          if (index === action.index) {
            return {
              ...participant,
              additionalData: action.additionalData,
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
