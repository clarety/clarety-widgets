import { types } from 'registrations/actions';

const initialState = {
  eventId: null,
  qtys: {},
  participants: [],
};

export const panelDataReducer = (state = initialState, action) => {
  switch (action.type) {
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

    default:
      return state;
  }
};
