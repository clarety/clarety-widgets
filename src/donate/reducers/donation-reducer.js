import { actionTypes } from '../actions';

const initialState = null;

export const donationReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.setDonation:
      return action.donation;

    default:
      return state;
  }
};
