import { actionTypes } from '../actions';

const initialState = {};

const suggestedDonationsReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.setSuggestedDonations:
      return action.payload;

    default:
      return state;
  }
};

export default suggestedDonationsReducer;
