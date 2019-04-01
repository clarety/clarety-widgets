import { actionTypes } from '../actions';

const initialState = {};

const suggestedDonationsReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.setSuggestedDonations:
      const newState = {};

      for (let suggestions of action.payload) {
        newState[suggestions.frequency] = suggestions;
      }

      return newState;

    default:
      return state;
  }
};

export default suggestedDonationsReducer;
